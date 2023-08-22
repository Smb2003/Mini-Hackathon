let AllPost = document.getElementById("AllPost");
let PersonalBlogs = document.getElementById("PersonalBlogs");
let Posts = document.getElementById("Posts");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut 
} 
from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { getDatabase, ref, set ,onValue,push,remove, update} 

from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAz7GtJGUvfxN9zSOQUymu4SdAHO8iZC5k",
  authDomain: "saylani-hackathon-fd7e5.firebaseapp.com",
  projectId: "saylani-hackathon-fd7e5",
  storageBucket: "saylani-hackathon-fd7e5.appspot.com",
  messagingSenderId: "242650642158",
  appId: "1:242650642158:web:b815e97d50174aec18a5ff",
  measurementId: "G-W6MWFPXHFL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);
console.log(auth);
console.log("db-->", db);

onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      document.getElementById('mainPageContainer').style.display = "block";
      document.getElementById('navbar').style.display = "none";
      getPost();
      getAllPost();
      if(AllPost){
        document.getElementById("AllPost").style.innerHTML = "block";
        document.getElementById('mainPageContainer').style.display = "block";
        document.getElementById('navbar').style.display = "none";
        document.getElementById("PersonalBlogs").style.display = "none"
      }
      // ...
    } else {
      // User is signed out
    
      document.getElementById('mainPageContainer').style.display = "block";
      // ...
    }
  });

  function getAllPost(){
    const postRef = ref(db, `posts/${uid}`);
    console.log("postRef-->", postRef);
    onValue(postRef, (snapshot) => {
      const IsdataExist = snapshot.exists();
      if(IsdataExist){
        document.getElementById("AllPost").innerHTML =  ' ';
        snapshot.forEach(childSnapshot => {
          const childKey = childSnapshot.key
          const childData = childSnapshot.val()
          console.log(childData);
          console.log('childKey=>', childKey)
          console.log('childData=>', childData)
          const cards = `<div id = ${childKey} class = "PostCard">
          <img src="Images/Avatar.jpeg" alt="Avatar" class="avatar">
           <h2 >${ childData.title}</h2> <h6>${childData.PostedAt}</h6> <p>${childData.description}</p> 
           <h5>${childData.Firstname}</h5>   <h5>${childData.Lastname}</h5>
          
           <button  class="editBtn" id =${childKey +
            '-edit'}>Edit</button> <button class="delBtn" id =${childKey +
            '-del'}>Delete</button></div>`
          document.getElementById("AllPost").innerHTML += cards
      }, 1000)
  }});
    }
  
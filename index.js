let signUpToPage = document.getElementById('SignUpToPage');
let signInToPage = document.getElementById('SignInToPage');
let signUp = document.getElementById("SignUp");
let signIn = document.getElementById("SignIn");
let LogOut = document.getElementById("LogOut");
let SubmitPost = document.getElementById("SubmitPost");
let AllPost = document.getElementById("AllPost");
let  BackToMyPost= document.getElementById("BackToMyPost");

//------------------------------------------------------------------------------------

AllPost.addEventListener("click", function(){
  document.getElementById("AllPostContainer").style.display = "block";
  document.getElementById("AllPostHeading").style.display = "block";
  document.getElementById("Dashboard").style.display = 'none';
  document.getElementById("MyBlogHeading").style.display = 'none';
  document.getElementById("PersonalBlogs").style.display = 'none';
  document.getElementById("Post").style.display = 'none';
})

BackToMyPost.addEventListener("click", function(){
  document.getElementById("AllPostContainer").style.display = "none";
  document.getElementById("AllPostHeading").style.display = "none";
  document.getElementById("Dashboard").style.display = 'block';
  document.getElementById("MyBlogHeading").style.display = 'block';
  document.getElementById("PersonalBlogs").style.display = 'block';
  document.getElementById("Post").style.display = 'block';
})

signUpToPage.addEventListener('click', signUpToPage);
signInToPage.addEventListener('click', signInToPage);

signUp && signUp.addEventListener('click', signUpToMainPage);
signIn.addEventListener('click', signInToMainPage);
LogOut.addEventListener('click', logOut);

SubmitPost.addEventListener('click', PublishPost);
AllPost.addEventListener("click", getAllPosts)

document.getElementById('SignUpToPage').addEventListener('click',function(){
  event.preventDefault()
  document.getElementById('SignInPage').style.display = "none";
  document.getElementById('RegisterPage').style.display = "block";
})
document.getElementById('SignInToPage').addEventListener('click',function(){
  event.preventDefault()
  document.getElementById('SignInPage').style.display = "block";
  document.getElementById('RegisterPage').style.display = "none";
})
//----------------------------------------------------------------------------------------

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
let obj;

function signUpToMainPage(){
  const reg_Firstname = document.getElementById('RegFirstName').value
  const reg_Lastname = document.getElementById('ReglastName').value
  const reg_email =  document.getElementById("Reg_email").value;
  const reg_password =  document.getElementById("Reg_password").value;
  createUserWithEmailAndPassword(auth, reg_email, reg_password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
     obj = {
      Firstname: reg_Firstname,
      Lastname: reg_Lastname,
      email: reg_email,
      password: reg_password,
      LoggedIn : new Date().toLocaleDateString()
    }
    const userRef = ref(db,`users/${user.uid}`);
    set(userRef, obj);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Registered Successfully',
      showConfirmButton: false,
      timer: 1500
    })
    

    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
   console.log(" errorMessage-->",  errorMessage);
    // ..
  });
}
function signInToMainPage(){
  const signIn_email =  document.getElementById("SignIn_email").value;
  const signIn_password =  document.getElementById("SignIn_password").value;
  signInWithEmailAndPassword(auth, signIn_email,signIn_password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'SignedIn Successfully',
      showConfirmButton: false,
      timer: 1500
    })
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(" errorMessage-->",  errorMessage);
  });
}
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    document.getElementById('SignInPage').style.display = "none";
    document.getElementById('RegisterPage').style.display = "none";
    document.getElementById('mainPageContainer').style.display = "block";
    document.getElementById('navbar').style.display = "none";
    getPost();
    getAllPosts()
    // if(AllPost){
    //   document.getElementById("AllPost").style.innerHTML = "block";
    //   document.getElementById('SignInPage').style.display = "none";
    //   document.getElementById('RegisterPage').style.display = "none";
    //   document.getElementById('mainPageContainer').style.display = "block";
    //   document.getElementById('navbar').style.display = "none";
    //   document.getElementById("PersonalBlogs").style.display = "none"
    // }
    // ...
  } else {
    // User is signed out
    document.getElementById('SignInPage').style.display = "none";
    document.getElementById('RegisterPage').style.display = "block";
    document.getElementById('mainPageContainer').style.display = "none";
    // ...
  }
});
function logOut(){
  signOut(auth).then(() => {
  console.log(" Sign-out successful");
    // Sign-out successful.
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'LoggedOut Successfully',
      showConfirmButton: false,
      timer: 1500
    })
  }).catch((error) => {
    // An error happened.
    console.log("Error Occured");
  });
}
function PublishPost(){
  const title = document.getElementById('post_title').value;
  const description = document.getElementById('post_description').value;
 
// document.getElementById('RegFirstName').value
//   const reg_Lastname = document.getElementById('ReglastName').value
  if(!title) return alert("Enter the Post Title");
  const postRef = ref(db,`posts/${auth.currentUser.uid}`);
  const postObj = {

    title,
    description,
    PostedAt: new Date().toLocaleDateString()
  }
  console.log("PostRef --> ", postRef);
  const newPostRef = push(postRef)
  console.log("newListRef --> ",newPostRef);
  set(newPostRef,postObj);
  document.getElementById('post_title').value = " ";
  document.getElementById('post_description').value = " ";

}
function getPost(){
  const postRef = ref(db, `posts/${auth.currentUser.uid}`);
  onValue(postRef, (snapshot) => {
    const IsdataExist = snapshot.exists();
    if(IsdataExist){
      document.getElementById("PersonalBlogs").innerHTML =  ' ';
      snapshot.forEach(childSnapshot => {
        const childKey = childSnapshot.key
        const childData = childSnapshot.val()
        console.log(childData);
        console.log('childKey=>', childKey)
        console.log('childData=>', childData)
        const cards = `<div id = ${childKey} class = "PostCard">
        <img src="Images/Avatar.jpeg" alt="Avatar" class="avatar">
         <h2 >${childData.title}</h2> <h6>${childData.PostedAt}</h6>
         <h6>Shaikh Muhammad Bilal</h6> <p>${childData.description}</p> 
        
         <button  class="editBtn" id =${childKey +
          '-edit'}>Edit</button> <button class="delBtn" id =${childKey +
          '-del'}>Delete</button></div>`
        document.getElementById("PersonalBlogs").innerHTML += cards
        setTimeout(() => {
          const editbtn = document.getElementById(childKey + '-edit')
          editbtn.addEventListener('click', editFunc)
          const deleteBtn = document.getElementById(childKey + '-del')
          deleteBtn.addEventListener('click', deleteFunc)
        
        }, 1000)
      });
    }
    
  });
}
function deleteFunc(){
  const elementId = this.id.slice(0,this.id.length - 4);
  console.log(elementId);
  const postRef = ref(db,`posts/${auth.currentUser.uid}/${elementId}`);
  remove(postRef)
}
function editFunc(){
  const elementId = this.id.slice(0,this.id.length -5)
  console.log(elementId);
  const postRef = ref(db,`posts/${auth.currentUser.uid}/${elementId}`);
  let newPostTitle = prompt('Edit your title', this.parentNode.firstChild.innerText);
  let newPostDescription =  prompt('Edit your Description', this.parentNode.firstChild.innerText);

  update(postRef, { title: newPostTitle, description: newPostDescription })
}

function getAllPosts() {
  let  AllPostContainer = document.getElementById("AllPostContainer");
  console.log(AllPostContainer);
  const postRef = ref(db, "posts");
  onValue(postRef, (snapshot) => {
    console.log('snapshot-->', snapshot.val())
    const data = snapshot.val();
    console.log("data-->",data);
      AllPostContainer.innerHTML = "";
      Object.values(data).forEach((post) => {
        console.log("post-->",post);
        Object.values(post).forEach((data)=>{
          console.log("data1-->",data);
          const card = `<div class = 'PostCard'>
          <img src="Images/Avatar.jpeg" alt="Avatar" class="avatar">
          <h2>${data.title} </h2>
          <h6>${data.PostedAt}</h6>
          <h6>${data.Firstname}</h6>
          <h6>${data.Lastname}</h6>
          <p> ${data.description}</p>
          </div>`
          
          AllPostContainer.innerHTML += card;
        })
         
    
        
      })

    }
    // updateStarCount(postElement, data);
  );
}



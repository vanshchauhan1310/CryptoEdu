// Import necessary Firebase modules
// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js"; // Optional, if you need authentication

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBJBPB_sYghfToEdEmLkvhlasEAuWlTdgA",
    authDomain: "crypto-edu.firebaseapp.com",
    projectId: "crypto-edu",
    storageBucket: "crypto-edu.firebasestorage.app",
    messagingSenderId: "601778919849",
    appId: "1:601778919849:web:7b5b9cb626faf0c437ccb8",
    measurementId: "G-YF3J7ZK7KM"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Optional, if you need authentication
import {  getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const commentsRef = collection(db, 'comments');

async function loadPendingComments() {
    const q = query(commentsRef, where("status", "==", "pending")); // Adjust the query as needed
    const querySnapshot = await getDocs(q);

    const pendingCommentsContainer = document.getElementById('pendingCommentsContainer'); // Ensure this ID matches
    pendingCommentsContainer.innerHTML = ''; // Clear previous content

    querySnapshot.forEach((doc) => {
        const comment = doc.data();
        const discussionElement = document.createElement('div');
        discussionElement.className = 'discussion';
        discussionElement.innerHTML = `
            <h5>${comment.title}</h5>
            <p>${comment.content}</p>
            <div>
                <button class="btn btn-success" onclick="approveComment('${doc.id}')">Approve</button>
                <button class="btn btn-danger" onclick="rejectComment('${doc.id}')">Reject</button>
            </div>
        `;
        pendingCommentsContainer.appendChild(discussionElement);
    });
}

// Function to load approved comments
function loadApprovedComments() {
    onSnapshot(query(commentsRef, where('status', '==', 'approved')), (snapshot) => {
        const approvedCommentsContainer = document.getElementById('approvedCommentsContainer');
        approvedCommentsContainer.innerHTML = '';

        snapshot.forEach((doc) => {
            const comment = doc.data();
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <h5>${comment.title}</h5>
                <p>${comment.content}</p>
            `;
            approvedCommentsContainer.appendChild(commentElement);
        });
    });
}

// Function to load rejected comments
// Function to load rejected comments
function loadRejectedComments() {
    const q = query(commentsRef, where('status', '==', 'rejected')); // Create a query for rejected comments
    onSnapshot(q, (snapshot) => { // Use the query here
        const rejectedCommentsContainer = document.getElementById('rejectedCommentsContainer');
        rejectedCommentsContainer.innerHTML = '';

        snapshot.forEach((doc) => {
            const comment = doc.data();
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <h5>${comment.title}</h5>
                <p>${comment.content}</p>
            `;
            rejectedCommentsContainer.appendChild(commentElement);
        });
    });
}

// Function to approve a comment
window.approveComment = async function(commentId) {
    const commentRef = doc(db, 'comments', commentId);
    await updateDoc(commentRef, { status: 'approved' });
    console.log('Comment approved');
};

// Function to reject a comment
window.rejectComment = async function(commentId) {
    const commentRef = doc(db, 'comments', commentId);
    await updateDoc(commentRef, { status: 'rejected' });
    console.log('Comment rejected');
};

// Load comments on page load
loadPendingComments();
loadApprovedComments();
loadRejectedComments();
function isAuthed() {
  // First hit "/me" and if the user exists, return true == logged in
  return Boolean(localStorage.getItem("token")); // If token exists in local strorage, ture
}

export { isAuthed };

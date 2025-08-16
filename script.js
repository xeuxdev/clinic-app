 function validateForm() {
      const name = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if (!name || !email || !phone || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
      alert("Account created successfully!");
    }
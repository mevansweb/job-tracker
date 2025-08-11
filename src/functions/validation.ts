export const validatePassword = (password: string) => {
    const validationErrors = [];
    if (password.length < 8) {
      validationErrors.push("Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
      validationErrors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[0-9]/.test(password)) {
      validationErrors.push("Password must contain at least one number.");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      validationErrors.push("Password must contain at least one special character (!@#$%^&*).");
    }
    return validationErrors;
  };
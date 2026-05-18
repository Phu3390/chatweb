export const validateLogin = (data: { email: string; password: string }) => {
  if (!data.email || !data.password) {
    return "Vui lòng nhập đầy đủ thông tin";
  }

  if (!data.email.includes("@")) {
    return "Email không hợp lệ";
  }

  return null;
};

export const validateSignup = (data: {
  fullName: string;
  email: string;
  password: string;
}) => {
  if (!data.fullName || !data.email || !data.password) {
    return "Vui lòng nhập đầy đủ thông tin";
  }

  if (data.fullName.trim().length < 2) {
    return "Họ tên phải có ít nhất 2 ký tự";
  }

  if (!data.email.includes("@")) {
    return "Email không hợp lệ";
  }

  if (data.password.length < 6) {
    return "Mật khẩu phải từ 6 ký tự trở lên";
  }

  return null;
};

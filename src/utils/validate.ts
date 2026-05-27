export const validateLogin = (data: { email: string; password: string }) => {
  if (!data.email || !data.password) {
    return "Vui lòng nhập đầy đủ thông tin";
  }

  if (!data.email.includes("@")) {
    return "Email không hợp lệ";
  }

  if (data.password.length < 6) {
    return "Mật khẩu phải từ 6 ký tự trở lên";
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

export const validateFormUpdateProfile = (data: {  fullName: string;
  email: string; avatar: string;}) => {
  if (!data.fullName || !data.email) {
    return "Vui lòng nhập đầy đủ thông tin";
  }
    if (data.fullName.trim().length < 2) {
    return "Họ tên phải có ít nhất 2 ký tự";
  }

  if (!data.email.includes("@")) {
    return "Email không hợp lệ";
  }
  return null;
}

export const validateFormCreateGroup = (data: {  groupName: string;
  selectedUsers: string[];}) => {
  if (!data.groupName || !data.selectedUsers || data.selectedUsers.length === 0) {
    return "Vui lòng nhập đầy đủ thông tin";
  }
    if (data.groupName.trim().length < 2) {
    return "Tên nhóm phải có ít nhất 2 ký tự";
  }
  return null;
}
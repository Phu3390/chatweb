// import { create } from "zustand";
// import type { ApiResponse } from "../types/response/api.response";
// import type { UploadResponse } from "../types/response/response.type";
// import { userService } from "../services/user.service";

// interface UploadState {
//   uploading: boolean;

//   uploadImage: (file: File) => Promise<ApiResponse<UploadResponse>>;
// }

// export const useUploadStore = create<UploadState>((set) => ({
//   uploading: false,

//   uploadImage: async (file) => {
//     try {
//       set({ uploading: true });

//       const formData = new FormData();
//       formData.append("file", file);

//       const res = await userService.uploadFile(formData);

//       return res.data;
//     } finally {
//       set({ uploading: false });
//     }
//   },
// }));

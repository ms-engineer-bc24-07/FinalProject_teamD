import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

export const createImageFormData = async (
  selectedImage: string,
  firebaseUid: string,
  referenceName?: string,
  referenceId?: string,
): Promise<FormData> => {
  try {
    // Base64データをBlobに変換
    const base64Data = selectedImage.split(',')[1];
    const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then((res) => res.blob());

    // dayjsで日時を取得し、ファイル名を生成
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const timestamp = dayjs().tz('Asia/Tokyo').format('YYYYMMDD-HHmmss');
    const fileName = `image_${firebaseUid}_${timestamp}.jpg`;

    // FormDataの作成
    const formData = new FormData();
    formData.append('image', blob, fileName);
    formData.append('firebaseUid', firebaseUid);
    if (referenceName) {
      formData.append('referenceName', referenceName);
    }
    if (referenceId) {
      formData.append('referenceId', referenceId);
    }

    return formData;
  } catch (error) {
    throw new Error(`Failed to create FormData.${error}`);
  }
};

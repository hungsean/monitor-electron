export const validateMP4FileNames = (fileNames: string[]): boolean => {
    
    // check filename is valid
    const isFilenameValid = fileNames.every(fileName => checkFileName(fileName));
    if (!isFilenameValid) {
        console.warn("one of the filename is not valid");
        return false;
    }

    const isSameTypeCamera = checkSameTypeAndCamera(fileNames);
    if (!isSameTypeCamera) {
        console.warn("type or camera is not the same");
        return false;
    }

    const isContinuous = checkContinuousVideos(fileNames);
    if (!isContinuous) {
        console.warn("time is not continuous");
        return false;
    }
    
    console.info("filename check successful");
    return true;
}

/**
 * Checks if a filename is valid based on its format and extension.
 * @param filename The filename to validate
 * @returns boolean indicating if the filename is valid
 */
export const checkFileName = (filename: string): boolean => {
    console.debug("now check filename: ", filename);

    // Split the filename into name and extension
    const [filenameNoExt, filenameExt] = splitEXT(filename);

    // Check if the extension is "mp4"
    if (filenameExt !== "mp4") {
        console.debug(filenameExt);
        console.warn("it didn't mp4 file");
        return false;
    }

    // Split the main filename by underscore
    const splitString = filenameNoExt.split("_");

    // Check if the split result has exactly 4 parts
    if (splitString.length !== 4) {
        console.warn("split string length is not 4");
        return false;
    }

    // Extract and validate start time (3rd part)
    const startTime = splitString[2];
    if (!isValidDatetime(startTime)) {
        console.warn("start time is not valid");
        return false;
    }

    // Extract and validate end time (4th part)
    const endTime = splitString[3];
    if (!isValidDatetime(endTime)) {
        console.warn("end time is not valid");
        return false;
    }

    // All checks passed
    return true;
}

const splitEXT = (filename: string): string[] => {
    const tempSplitString = filename.split(".");
    if (tempSplitString.length > 1) {
        return [tempSplitString.slice(0, -1).join(""), tempSplitString[tempSplitString.length - 1]]
    }
    else {
        return [...tempSplitString, ""];
    }
}

/**
 * Regular expression for validating datetime in format: YYYY-MM-DDThhmmss
 * Example: 2025-02-02T013000
 */
const datetimeRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|1\d|2\d|3[0-1])T(0\d|1\d|2[0-3])([0-5]\d)([0-5]\d)$/;


/**
 * Validates if a string matches the required datetime format
 * 
 * @param dateTimeStr 
 * The datetime string to validate
 * 
 * @returns 
 * boolean indicating if the string matches the format
 */

const isValidDatetime = (dateTimeStr: string): boolean => {
    console.debug("now time: ", dateTimeStr);

    // Check if the string matches the regex
    if (!datetimeRegex.test(dateTimeStr)) {
        console.warn("time is not fit regex");
        return false;
    }

    // Extract parts to validate actual date
    const year = parseInt(dateTimeStr.substring(0, 4), 10);
    const month = parseInt(dateTimeStr.substring(5, 7), 10);
    const day = parseInt(dateTimeStr.substring(8, 10), 10);

    // Basic validation for month days
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) {
        console.warn("day is not valid");
        return false;
    }

    return true;
};

/**
 * 檢查檔名陣列中所有檔案是否具有相同的 Type 和 Camera_name
 * @param filenames 檔名陣列
 * @returns 如果所有檔案都有相同的 Type 和 Camera_name 則返回 true，否則返回 false
 */
const checkSameTypeAndCamera = (filenames: string[]): boolean => {
  if (filenames.length <= 1) {
    return true; // 空陣列或只有一個檔案的情況，預設為 true
  }

  // 從第一個檔名中提取 Type 和 Camera_name 作為參考標準
  const parts = filenames[0].split('_');
  if (parts.length < 4) {
    return false; // 檔名格式不符合預期
  }

  const referenceType = parts[0];
  const referenceCamera = parts[1];

  // 檢查其他所有檔名
  for (let i = 1; i < filenames.length; i++) {
    const currentParts = filenames[i].split('_');
    
    // 確認檔名格式是否正確
    if (currentParts.length < 4) {
      return false;
    }
    
    // 檢查 Type 和 Camera_name 是否與參考標準相同
    if (currentParts[0] !== referenceType || currentParts[1] !== referenceCamera) {
      return false;
    }
  }

  return true;
}

/**
 * 檢查檔名陣列中的影片是否連續
 * @param filenames 檔名陣列
 * @returns 如果所有檔案連續則返回 true，否則返回 false
 */
const checkContinuousVideos = (filenames: string[]): boolean => {
  if (filenames.length <= 1) {
    return true; // 空陣列或只有一個檔案，視為連續
  }

  // 解析檔名，提取時間戳
  const videoInfo = filenames.map(filename => {
    const parts = filename.split('_');
    if (parts.length < 4) {
      return null; // 檔名格式不符合預期
    }
    return {
      filename,
      startTime: parts[2],
      endTime: parts[3].replace('.mp4', '')
    };
  });

  // 檢查是否有無效的檔名格式
  if (videoInfo.includes(null)) {
    return false;
  }

  // 依照開始時間排序
  videoInfo.sort((a, b) => a!.startTime.localeCompare(b!.startTime));

  // 檢查連續性
  for (let i = 0; i < videoInfo.length - 1; i++) {
    const currentVideo = videoInfo[i]!;
    const nextVideo = videoInfo[i + 1]!;
    
    // 檢查當前影片的結束時間是否與下一個影片的開始時間相同
    if (currentVideo.endTime !== nextVideo.startTime) {
      return false;
    }
  }

  return true;
}



export const extractFileNames = (files: FileList | null): string[] => {
    if (!files) return [];
    
    // 將 FileList 轉為陣列並提取每個檔案的名稱
    return Array.from(files).map(file => file.name);
};



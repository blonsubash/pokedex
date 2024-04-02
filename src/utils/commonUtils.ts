import toast from "react-hot-toast";

export const showToastSuccess = (successMessage: string) => {
  toast.success(successMessage && successMessage);
};

export const showToastError = (errorMessage: string) => {
  toast.error(errorMessage && errorMessage);
};

export const getNamePascalCase = (words: string) => {
  if (words) {
    let tempWords = words?.split(" ");
    tempWords = tempWords?.map((word: string) =>
      word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ""
    );
    return tempWords.join(" ");
  } else {
    return words;
  }
};

export const generateRandomNumString = (length: number): string => {
  const characters = '0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};

export const convertPhoneNumToInternationalFormat = (
  phoneNumber: string,
): string => {
  // Remove non-numeric characters
  phoneNumber = phoneNumber.replace(/\D/g, '');

  // Check if the number starts with '0' and replace with '+234'
  if (phoneNumber.startsWith('0')) {
    phoneNumber = '+234' + phoneNumber.slice(1);
  }

  // Check if the number starts with '234' and replace with '+234'
  if (phoneNumber.startsWith('234')) {
    phoneNumber = '+234' + phoneNumber.slice(3);
  }

  return phoneNumber;
};

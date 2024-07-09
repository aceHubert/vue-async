export default function () {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('sortTest');
      resolve(null);
    }, 3000);
  });
}

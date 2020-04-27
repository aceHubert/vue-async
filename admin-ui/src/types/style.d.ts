
// style module
declare module '*.module' {
  const content: { [className: string]: string };
  export default content;
}

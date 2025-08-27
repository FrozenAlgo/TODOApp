function NotFound() {
  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center gap-4 font-extrabold text-4xl md:text-7xl flex-col flex-wrap">
        Page Not Found
        <a href="/" className="text-blue-600 text-2xl  md:text-4xl underline ">
          Go to Homepage
        </a>
      </div>
    </>
  );
}
export default NotFound;

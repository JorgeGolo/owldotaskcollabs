import Head from "next/head";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | OwldoTask</title>
      </Head>
      <div className="flex flex-col justify-center items-center text-center p-8 font-sans bg-gray-100">
        <div className="text-7xl">🦉</div>
        <h1 className="text-2xl mt-4 font-semibold">404 - Page Not Found</h1>
        <p className="max-w-md my-4 text-gray-600">
          Whoops... the owl couldn't find what you were looking for. The page
          may have been moved or never existed.
        </p>
        <a
          href="/"
          className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
        >
          Go back home
        </a>
      </div>
    </>
  );
}

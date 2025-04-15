export default function Header() {
    return (
      <header className="bg-gray-900 bg-opacity-80 py-4 px-6 backdrop-filter backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-200 via-teal-200 to-blue-200  bg-clip-text text-transparent">
            Digital Canvas
          </h1>
          <p className="text-gray-300 italic">Create beautiful art with ease</p>
        </div>
      </header>
    );
  }
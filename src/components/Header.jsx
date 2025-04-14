export default function Header() {
    return (
      <header className="bg-gray-900 bg-opacity-80 py-4 px-6 backdrop-filter backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Digital Canvas
          </h1>
          <p className="text-gray-300 italic">Create beautiful art with ease</p>
        </div>
      </header>
    );
  }
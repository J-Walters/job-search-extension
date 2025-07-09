import './App.css';

function App() {
  return (
    <div className='max-w-sm mx-auto p-6 bg-white rounded-2xl shadow-md'>
      <header className='p-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Clocked In</h1>
          <button
            type='button'
            className='px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200'
          >
            Sign In
          </button>
        </div>
        <nav className='mt-4 flex space-x-2'>
          <button
            type='button'
            className='px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200'
          >
            Search
          </button>
          <button
            type='button'
            className='px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200'
          >
            Saved
          </button>
          <button
            type='button'
            className='px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200'
          >
            Settings
          </button>
        </nav>
      </header>
      <main className='p-4'>
        <form className='space-y-4'>
          <div>
            <label className='block font-medium text-gray-700 mb-1'>
              Keywords:
            </label>
            <input
              type='text'
              placeholder='e.g., Software Engineer'
              autoFocus
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='block font-medium text-gray-700 mb-1'>
              Search Radius (miles):
            </label>
            <input
              type='number'
              placeholder='25'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='block font-medium text-gray-700 mb-1'>
              Filter by Time:
            </label>
            <select className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
              <option>Past 30 Minutes</option>
              <option>Past Hour</option>
            </select>
            <span className='text-sm text-gray-500 mt-1 block'>
              Select the time frame to filter jobs.
            </span>
          </div>
          <div>
            <label className='block font-medium text-gray-700 mb-1'>
              Sort By:
            </label>
            <select
              value='test'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option>Relevance</option>
              <option>Most Recent</option>
            </select>
            <span className='text-sm text-gray-500 mt-1 block'>
              Select how you want the job listings to be sorted.
            </span>
          </div>
          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition'
          >
            Go to LinkedIn
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;

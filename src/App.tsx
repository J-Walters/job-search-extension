import './App.css';

function App() {
  return (
    <div className='max-w-lg mx-auto p-6 rounded-2xl shadow-lg bg-gray-50 shadow-violet-200/20'>
      <header className='flex flex-col'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-semibold text-gray-700'>Clocked In</h1>
          <button
            type='button'
            className='px-3 py-1 rounded-lg bg-white text-gray-600 text-sm font-medium shadow-sm border border-gray-100'
          >
            Sign In
          </button>
        </div>
        <nav className='mt-8 flex justify-between rounded-xl bg-white px-2 py-1.5 shadow-sm border border-gray-100 text-gray-600 text-sm'>
          <button className='flex-1 px-3'>Search</button>
          <button className='flex-1 px-3'>Saved</button>
          <button className='flex-1 px-3'>Settings</button>
        </nav>
      </header>
      <main className='mt-6'>
        <form className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-1'>
              Keywords:
            </label>
            <input
              type='text'
              placeholder='e.g., Software Engineer'
              className='w-full px-4 py-2.5 rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50 text-gray-600 shadow-inner border border-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:ring-offset-0'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-1'>
              Search Radius (miles):
            </label>
            <input
              type='number'
              placeholder='25'
              className='w-full px-4 py-2.5 rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50 text-gray-600 shadow-inner border border-gray-100 focus:outline-none'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-1'>
              Filter by Time:
            </label>
            <select className='w-full px-4 py-2.5 rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50 text-gray-600 shadow-inner border border-gray-100 focus:outline-none'>
              <option>Past 30 Minutes</option>
              <option>Past Hour</option>
            </select>
            <span className='text-xs text-gray-400 mt-1 block'>
              Select the time frame to filter jobs.
            </span>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-1'>
              Sort By:
            </label>
            <select className='w-full px-4 py-2.5 rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50 text-gray-600 shadow-inner border border-gray-100 focus:outline-none'>
              <option>Relevance</option>
              <option>Most Recent</option>
            </select>
            <span className='text-xs text-gray-400 mt-1 block'>
              Select how you want the job listings to be sorted.
            </span>
          </div>
          <button
            type='submit'
            className='w-full py-2 rounded-2xl bg-white text-gray-600 text-sm font-medium shadow-sm border border-gray-100 hover:shadow-md active:shadow-inner transition'
          >
            Go to LinkedIn
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;

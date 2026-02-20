function MeasurementForm() {
  return (
    <div className="absolute right-4 top-4 bg-gray-200 w-96 h-96 rounded-lg p-2 flex flex-col gap-4">
      <span className="text-gray-900">Measurements</span>
      <form>
        <label htmlFor="x-coord" className="text-gray-900">
          Enter X coord:
        </label>
        <input
          id="x-coord"
          className="w-full p-2 border bg-gray-50 border-gray-300 rounded-md mt-2"
        />

        <label htmlFor="y-coord" className="text-gray-900">
          Enter Y coord:
        </label>
        <input
          id="y-coord"
          className="w-full p-2 border bg-gray-50 border-gray-300 rounded-md mt-2"
        />
        <button
          formAction="submit"
          className="mt-2 bg-blue-500 text-white p-2 rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default MeasurementForm;

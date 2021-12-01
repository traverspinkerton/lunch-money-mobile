export default function Login() {
  const onSubmit = (event) => {
    event.preventDefault();
    if (event.target && event.target["password"]) {
      document.cookie = "lm_secret=" + event.target["password"].value;
      window.location = "/";
    }
  };
  return (
    <div className="bg-yellow-300 p-8 font-bold text-gray-800">
      <form className="grid" onSubmit={onSubmit}>
        <label className="flex justify-between" htmlFor="password">
          password
          <input
            className="ml-4 rounded"
            type="password"
            name="password"
            required
          />
        </label>
        <button className="bg-gray-100 mt-4" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

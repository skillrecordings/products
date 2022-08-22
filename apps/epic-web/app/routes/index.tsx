export default function Index() {
  return (
    <div className="prose">
      <h1>Welcome to Epic Web Dev</h1>
      <div>
        <form method="post" action="/subscribe">
          <p>
            <label>
              Name: <input name="first_name" type="text" />
            </label>
          </p>
          <p>
            <label>
              Email: <input name="email" type="email" required={true} />
            </label>
          </p>
          <p>
            <button type="submit">Create</button>
          </p>
        </form>
      </div>
    </div>
  )
}

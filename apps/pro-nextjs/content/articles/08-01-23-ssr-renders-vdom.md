# Does NextJS SSR Render just the VDOM Nodes?

One of the great things about running a YouTube channel are the amazing questions that I get that give me some insights into how folks are thinking about React and NextJS. One recent question was about the NextJS App Router and whether it renders only VDOM or if it renders the entire page.

**Answer**: The App Router renders the requested route into **both** the Virtual DOM (VDOM) and the HTML. The HTML is what the customer sees on the page, and the VDOM is used to initialize the React Virtual DOM on the client.

There are three ways you can see exactly what's coming out of your NextJS server for a given route. You can `curl` it on the command line using a command like this:

```bash
curl http://localhost:3000
```

Or if you don't like the command line you can right click on the page in the browser and select `View Page Source`. The page source is exactly what came back from the server. It is not a live view of the current DOM of the page.

A third way is to bring up the inspector in your browser, select the `Network` tab, and then refresh the page. The first item in the list will be `GET` request for the current route and the response is the HTML that came back from the server. You can click on that item and then select the `Preview` tab to see the HTML.

The response from the server looks pretty bad because all of the whitespace is removed between the tags, so it will all be on one line. In the browser if you are viewing the page source you can click on the `Line Wrap` option to at least see all the HTML.

At the top you will see the rendered HTML of the components. Below that is a **large** set of script tags that set up the Virtual DOM on the client. Those aren't really VDOM nodes per se, they are a combination of component references, props, rendered DOM nodes, and other information that is used to initialize the client side VDOM.

If you want you can analyse that VDOM section further using this [RSC Parser tool](https://rsc-parser.vercel.app).

I can understand why you might think the server only generates VDOM nodes since React does so much client side rendering. But believe me, if the server only generated VDOM nodes then the page would be blank, and search engines would have nothing to index if they only looked at the HTML. That would give Search Engine Optimization folks a heart attack.

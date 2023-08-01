# Why not just fetch all the data from the client?

Question: Why not just fetch all the data from the client? Why do we need to fetch data on the server?

Answer: There are several key advantages to fetching data on the server:

- **It's Usually Faster** - NextJS servers are usually deployed in the same Virtual Private Cluster (VPC) as the microservices they call. This means that the network latency between the NextJS server and the microservices is very low. This is not the case for the client. A customer web client can be anywhere, and the network latency between the client and the microservices is much higher. This means that fetching data on the server is usually faster than fetching it on the client.

- **Microservices Stay Behind the Firewall** - If only the NextJS server (or other microservices) can talk to the microservices then those microservices can stay behind the firewall. This means the surface area of attacks is limited to just the NextJS server itself. To make the API calls from the client we would have to expose the microservices to the public internet, which expands the security risk.

- **API Keys Are Hidden** - If we are using third party serivces as part of our application then those probably have API keys. Those keys should never go out to the client. Making the requests only from the NextJS server ensures that those keys are hidden.

- **Search Engine Optimization** - Server side rendering, where the server renders HTML in response to a request, has long been the preferred choice of Search Engine Optimization (SEO) professionals. It is an arguable point that nowadays search engines can index client side rendered pages, but if you have a site where SEO is an important point then most likely they will prefer the SEO relevant portions of the site to be server side rendered.

This is not to say that client side fetching is a bad thing, it's not. There are many cases where client side fetching is the right choice. But if you are building a NextJS application then you should consider server side fetching as the default choice.

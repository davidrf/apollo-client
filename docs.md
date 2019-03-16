---
title: Introduction
description: What is Apollo Client and what does it do?
---

Apollo Client is the best way to use GraphQL to build client applications. The client is designed to help you quickly build a UI that fetches data with GraphQL, and can be used with any JavaScript front-end. The client is:

- **Incrementally adoptable:** You can drop it into an existing app today.
- **Universally compatible:** Apollo works with any build setup, any GraphQL server, and any GraphQL schema.
- **Simple to get started with:** Start loading data right away and learn about advanced features later.
- **Inspectable and understandable:** Interrogate and understand exactly what is happening in an application.
- **Built for interactive apps:** Application users make changes and see them reflected immediately.
- **Small and flexible:** You don't get stuff your application doesn't need.
- **Community driven:** Apollo is driven by the community and serves a variety of use cases.

<h2 title="Getting started" id="starting">Getting started</h2>

The docs for Apollo Client are mainly written using the [React integration](./essentials/get-started.html), but most of the examples work no matter where you use Apollo. The docs are broken into five distinct sections to make it easy to find your way around:

1. **ESSENTIALS:** Outlines everything you need to know in order to get up and running quickly.
2. **FEATURES:** Details the amazing things you can do with Apollo Client.
3. **ADVANCED:** Covers the more advanced Apollo Client capabilities that your app may need.
4. **RECIPES:** Learn about and understand common patterns.
5. **API:** Full API details for Apollo Client and React Apollo.

<h2 id="other-platforms" title="Prefer a non-React Platform?">Prefer a non-React platform?</h2>

Most of this sites documentation examples are written using React, but Apollo Client supports many other platforms:

- JavaScript
  - [Angular](/docs/angular)
  - [Vue](./integrations.html#vue)
  - [Meteor](./recipes/meteor.html)
  - [Ember](./integrations.html#ember)
- Web Components
  - [Polymer](./integrations.html#web-components)
  - [lit-apollo](./integrations.html#web-components)
- Native mobile
  - [Native iOS with Swift](/docs/ios)
  - [Native Android with Java](/docs/android)

<h2 id="graphql-servers">Just using GraphQL?</h2>

We believe that using GraphQL should be easy and fun. One of the ways that Apollo supports this is that you can write your queries in [GraphiQL](https://github.com/graphql/graphiql) and they will just work with Apollo Client! Because Apollo Client doesn't assume anything beyond the official GraphQL specification, it works with every GraphQL server implementation, for _every_ language. Apollo Client doesn't impose any requirements on your schema either! If you can send a query to a standard GraphQL server, Apollo Client can handle it. You can find a list of
GraphQL server implementations at [graphql.org](http://graphql.org/code/#server-libraries).

---

title: Why Apollo Client?
description: Why choose Apollo Client to manage your data?

---

Data management shouldn't have to be so difficult! If you're wondering how to simplify managing remote and local data in your React application, then you've come to the right place. Through practical examples inspired by our [example app Pupstagram](https://codesandbox.io/s/r5qp83z0yq), you'll learn how Apollo's intelligent caching and declarative approach to data fetching can help you iterate faster while writing less code. Let's jump right in! 🚀

<h2 id="declarative-data">Declarative data fetching</h2>

With Apollo's declarative approach to data fetching, all of the logic for retrieving your data, tracking loading and error states, and updating your UI is encapsulated in a single Query component. This encapsulation makes composing your Query components with your presentational components a breeze! Let's see what this looks like in practice with React Apollo:

```js
const Feed = () => (
  <Query query={GET_DOGS}>
    {({ loading, error, data }) => {
      if (error) return <Error />;
      if (loading || !data) return <Fetching />;

      return <DogList dogs={data.dogs} />;
    }}
  </Query>
);
```

Here we're using a Query component to fetch some dogs from our GraphQL server and display them in a list. The Query component uses the React [render prop API](https://reactjs.org/docs/render-props.html) (with a function as a child) to bind a query to our component and render it based on the results of our query. Once our data comes back, our `<DogList />` component will update reactively with the data it needs.

Apollo Client takes care of the request cycle from start to finish, including tracking loading and error states for you. There's no middleware to set up or boilerplate to write before making your first request, nor do you need to worry about transforming and caching the response. All you have to do is describe the data your component needs and let Apollo Client do the heavy lifting. 💪

You'll find that when you switch to Apollo Client, you'll be able to delete a lot of unnecessary code related to data management. The exact amount will vary depending on your application, but some teams have reported up to thousands of lines. While you'll find yourself writing less code with Apollo, that doesn't mean you have to compromise on features! Advanced features like optimistic UI, refetching, and pagination are all easily accessible from the Query component props.

<h2 id="caching">Zero-config caching</h2>

One of the key features that sets Apollo Client apart from other data management solutions is its normalized cache. Just by setting up Apollo Client, you get an intelligent cache out of the box with no additional configuration required. From the home page of the [Pupstagram example app](https://codesandbox.io/s/r5qp83z0yq), click one of the dogs to see its detail page. Then, go back to the home page. You'll notice that the images on the home page load instantaneously, thanks to the Apollo cache.

```js
import ApolloClient from "apollo-boost";

// the Apollo cache is set up automatically
const client = new ApolloClient();
```

Caching a graph is no easy task, but we've spent two years focused on solving it. Since you can have multiple paths leading to the same data, normalization is essential for keeping your data consistent across multiple components. Let's look at some practical examples:

```js
const GET_ALL_DOGS = gql`
  query {
    dogs {
      id
      breed
      displayImage
    }
  }
`;

const UPDATE_DISPLAY_IMAGE = gql`
  mutation UpdateDisplayImage($id: String!, $displayImage: String!) {
    updateDisplayImage(id: $id, displayImage: $displayImage) {
      id
      displayImage
    }
  }
`;
```

The query, `GET_ALL_DOGS`, fetches a list of dogs and their `displayImage`. The mutation, `UPDATE_DISPLAY_IMAGE`, updates a single dog's `displayImage`. If we update the `displayImage` on a specific dog, we also need that item on the list of all dogs to reflect the new data. Apollo Client splits out each object in a GraphQL result with a `__typename` and an `id` property into its own entry in the Apollo cache. This guarantees that returning a value from a mutation with an id will automatically update any queries that fetch the object with the same id. It also ensures that two queries which return the same data will always be in sync.

Features that are normally complicated to execute are trivial to build with the Apollo cache. Let's go back to our `GET_ALL_DOGS` query from the previous example that displays a list of dogs. What if we want to transition to a detail page for a specific dog? Since we've already fetched information on each dog, we don't want to refetch the same information from our server. With cache redirects, the Apollo cache lets us connect the dots between two queries so we don't have to fetch information that we know is already available.

Here's what our query for one dog looks like:

```js
const GET_DOG = gql`
  query {
    dog(id: "abc") {
      id
      breed
      displayImage
    }
  }
`;
```

Here's our cache redirect, which we can set up easily by specifying a map on the `cacheRedirects` property of the `apollo-boost` client. The cache redirect returns a key that the query can use to look up the data in the cache.

```js
import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  cacheRedirects: {
    Query: {
      dog: (_, { id }, { getCacheKey }) =>
        getCacheKey({ id, __typename: "Dog" })
    }
  }
});
```

<h2 id="combine-data">Combine local & remote data</h2>

Thousands of developers have told us that Apollo Client excels at managing remote data, which equates to roughly 80% of their data needs. But what about local data (like global flags and device API results) that make up the other 20% of the pie? This is where `apollo-link-state` comes in, our solution for local state management that allows you to use your Apollo cache as the single source of truth for data in your application.

Managing all your data with Apollo Client allows you to take advantage of GraphQL as a unified interface to all of your data. This enables you to inspect both your local and remote schemas in Apollo DevTools through GraphiQL.

```js
const GET_DOG = gql`
  query GetDogByBreed($breed: String!) {
    dog(breed: $breed) {
      images {
        url
        id
        isLiked @client
      }
    }
  }
`;
```

With `apollo-link-state`, you can add client-side only fields to your remote data seamlessly and query them from your components. In this example, we're querying the client-only field `isLiked` alongside our server data. Your components are made up of local and remote data, now your queries can be too!

<h2 id="ecosystem">Vibrant ecosystem</h2>

Apollo Client is easy to get started with, but extensible for when you need to build out more advanced features. If you need custom functionality that isn't covered with `apollo-boost`, such as app-specific middleware or cache persistence, you can create your own client by plugging in an Apollo cache and chaining together your network stack with Apollo Link.

This flexibility makes it simple to create your dream client by building extensions on top of Apollo. We're always really impressed by what our contributors have built on top of Apollo - check out some of their packages:

- [Apollo Link community links](/docs/link/links/community.html): Pluggable links created by the community
- [apollo-cache-persist](https://blog.apollographql.com/announcing-apollo-cache-persist-cb05aec16325): Simple persistence for your Apollo cache ([@jamesreggio](https://github.com/jamesreggio))
- [apollo-storybook-decorator](https://github.com/abhiaiyer91/apollo-storybook-decorator): Wrap your React Storybook stories with Apollo Client ([@abhiaiyer91](https://github.com/abhiaiyer91))
- [AppSync by AWS](https://blog.apollographql.com/aws-appsync-powered-by-apollo-df61eb706183): Amazon's real-time GraphQL client uses Apollo Client under the hood

When you choose Apollo to manage your data, you also gain the support of our amazing community. There are thousands ov developers in our [Apollo Spectrum community](https://spectrum.chat/apollo) for you to share ideas with. You can also read articles on best practices and our announcements on the [Apollo blog](https://blog.apollographql.com/), updated weekly.

<h2 id="case-studies">Case studies</h2>

Companies ranging from enterprises to startups trust Apollo Client to power their most critical web & native applications. If you'd like to learn more about how transitioning to GraphQL and Apollo simplified their engineers' workflows and improved their products, check out these case studies:

- [The New York Times](https://open.nytimes.com/the-new-york-times-now-on-apollo-b9a78a5038c): Learn how The New York Times switched from Relay to Apollo & implemented features in their app such as SSR and persisted queries
- [Express](https://blog.apollographql.com/changing-the-architecture-of-express-com-23c950d43323): Easy-to-use pagination with Apollo helped improve the Express eCommerce team's key product pages
- [Major League Soccer](https://blog.apollographql.com/reducing-our-redux-code-with-react-apollo-5091b9de9c2a): MLS' switch from Redux to Apollo for state management enabled them to delete nearly all of their Redux code
- [Expo](https://blog.apollographql.com/using-graphql-apollo-at-expo-4c1f21f0f115): Developing their React Native app with Apollo allowed the Expo engineers to focus on improving their product instead of writing data fetching logic
- [KLM](https://youtu.be/T2njjXHdKqw): Learn how the KLM team scaled their Angular app with GraphQL and Apollo

## If your company is using Apollo Client in production, we'd love to feature a case study on our blog! Please get in touch via Spectrum so we can learn more about how you're using Apollo. Alternatively, if you already have a blog post or a conference talk that you'd like to feature here, please send in a PR.

title: View integrations
subtitle: Using Apollo Client with your view layer
description: How to use Apollo Client with the view layer your application is developed in!

---

<h2 id="react" title="React">React</h2>

React Apollo allows you to fetch data from your GraphQL server and use it in building complex and reactive UIs using the React framework. React Apollo may be used in any context that React may be used. In the browser, in React Native, or in Node.js when you want to server side render.

React Apollo, unlike some other tools in the React ecosystem, requires _no_ complex build setup to get up and running. As long as you have a GraphQL server you can get started building out your application with React immediately. React Apollo works out of the box with both [`create-react-app`](https://github.com/facebookincubator/create-react-app) and [React Native](http://facebook.github.io/react-native) with a single install and with no extra hassle configuring Babel or other JavaScript tools.

<h2 id="vue" title="Vue">Vue</h2>

A [Vue.js](https://vuejs.org/) integration is maintained by Guillaume Chau ([@Akryum](https://github.com/Akryum)). See the Github [repository](https://github.com/Akryum/vue-apollo) for more details.

<h2 id="angular" title="Angular">Angular</h2>

To use Apollo with the [Angular](https://angular.io) rendering library, see the [Angular guide](/docs/angular);

<h2 id="ember" title="Ember">Ember</h2>

There are two [Ember](http://emberjs.com/) integrations available:

- [ember-apollo-client](https://github.com/bgentry/ember-apollo-client) is maintained by Blake Gentry ([@bgentry](https://github.com/bgentry)).
- [ember-apollo](https://github.com/jlevycpa/ember-apollo) is maintained by Jeff Levy ([@jlevycpa](https://github.com/jlevycpa)).

<h2 id="web-components" title="Web Components">Web Components</h2>

- **Polymer:** A [Polymer](https://www.polymer-project.org/) integration is maintained by Arun Kumar T K ([@aruntk](https://github.com/aruntk)). See the Github [repository](https://github.com/aruntk/polymer-apollo) for more details.
- **lit-apollo:** A set of custom-element base classes that extend from LitElement which let you easily compose front-end apps in a framework-agnostic way. [`lit-apollo`](https://github.com/bennypowers/lit-apollo) is maintained by Benny Powers ([@bennypowers](https://github.com/bennypowers)).

---

title: New in React Apollo 2.1
description: A guide to what's new in React Apollo 2.1

---

React Apollo was designed from the beginning to make using Apollo with React the easiest possible experience. For a long time, this meant using higher order components to configure and connect Apollo to your React application. With React Apollo 2.1, using the two together is easier and more natural than ever thanks to the brand new Apollo Components! 🚀

**Important**: The 2.1 version only introduces new features, it doesn't remove, break, or deprecate any existing usage of the `graphql` higher order component. You should be able to start using the new features as they make sense without worrying about a full rewrite of your app!

<h2 id="query-component">The Query Component</h2>

Thinking in components is one of the many amazing things that React brings to teams building applications. With React Apollo 2.1, you can now easily manage your data just using components as well. It is incredibly simple to get started, all you need is a GraphQL query and the new `<Query />` component (note: this assumes you have setup the ApolloProvider in your tree).

```js
const GET_DOGS = gql`
  query GetDogs {
    dogs {
      id
      name
    }
  }
`;

const GoodDogsBrent = () => (
  <Query query={GET_DOGS}>
    {({ loading, error, data }) => {
      if (error) return <Error />;
      if (loading || !data) return <Fetching />;

      return <DogList dogs={data.dogs} />;
    }}
  </Query>
);
```

<h3 id="upgrading-from-graphql-to-query">Upgrading from `graphql` to `<Query />`</h3>

You may love the Query component enough to start rewriting parts of your app to use it ([I know we do!](https://github.com/apollographql/GitHunt-React/pull/275)). Upgrading existing connected components is really easy! Let's take a look at what a refactor could look like:

First let's start with a graphql connected component that uses props for the fetchPolicy and passes the loading and currentUser to its wrapped component:

```js
const PROFILE_QUERY = gql`
  query GetUser {
    currentUser {
      firstName
    }
  }
`;

const Profile = ({ loading, currentUser }) => {
  if (loading) return <span>loading....</span>;
  return <h1>Welcome back {currentUser.firstName}</h1>;
};

export default graphql(PROFILE_QUERY, {
  options: ({ refetch }) => ({
    fetchPolicy: refetch ? "cache-and-network" : "cache-first"
  }),
  props: ({ data: { loading, currentUser } }) => ({
    loading,
    currentUser
  })
})(Profile);
```

Writing this with the Query component would look something like this:

```js
const PROFILE_QUERY = gql`
  query GetUser {
    currentUser {
      firstName
    }
  }
`;

const Profile = ({ refetch }) => (
  <Query
    query={PROFILE_QUERY}
    fetchPolicy={refetch ? "cache-and-network" : "cache-first"}
  >
    {({ loading, data: { currentUser } }) => {
      if (loading) return <span>loading....</span>;
      return <h1>Welcome back {currentUser.firstName}</h1>;
    }}
  </Query>
);
```

And just like that we have the same UI but everything is a component!

<h3 id="compose-to-render-composition">Updating multiple connected components with compose</h3>

In some cases, it may make sense to split your queries into different operations for reuse, better performance, and separation of concerns. In the past, to easily group all of those data requirements together meant using the `compose` function from React Apollo. Now, you can just compose them directly in your render function! Take a look at this simple example:

```js
const QueryOne = gql`
  query One {
    one
  }
`;

const QueryTwo = gql`
  query Two {
    two
  }
`;

const withOne = graphql(QueryOne, {
  props: ({ data }) => ({
    loadingOne: data.loading,
    one: data.one
  })
});

const withTwo = graphql(QueryTwo, {
  props: ({ data }) => ({
    loadingTwo: data.loading,
    two: data.two
  })
});

const Numbers = ({ loadingOne, loadingTwo, one, two }) => {
  if (loadingOne || loadingTwo) return <span>loading...</span>;
  return (
    <h3>
      {one} is less than {two}
    </h3>
  );
};

const NumbersWithData = compose(
  withOne,
  withTwo
)(Numbers);
```

Sure is a lot for a "simple" example right? Here is the same code using the new Query component:

```js
const QueryOne = gql`
  query One {
    one
  }
`;

const QueryTwo = gql`
  query Two {
    two
  }
`;

const NumbersWithData = () => (
  <Query query={QueryOne}>
    {({ loading: loadingOne, data: { one } }) => (
      <Query query={QueryTwo}>
        {({ loading: loadingTwo, data: { two } }) => {
          if (loadingOne || loadingTwo) return <span>loading...</span>;
          return (
            <h3>
              {one} is less than {two}
            </h3>
          );
        }}
      </Query>
    )}
  </Query>
);
```

And just like that, we have two composed queries! To explore more migration examples, take a look at each individual commit on this [pull request](https://github.com/apollographql/GitHunt-React/pull/275). It shows a number of use cases being refactored to the new components.

For more information on how to use the new Query component, read the [full guide](./essentials/queries.html)!

<h2 id="components">The Mutation and Subscription Components</h2>

Much like the Query component, the Mutation and Subscription component are ways to use Apollo directly within your react tree. They simplify integrating with Apollo, and keep your React app written in React! For more information on the Mutation component, [check out the usage guide](./essentials/mutations.html) or if you are wanting to learn about the Subscription component, [read how to here](./advanced/subscriptions.html).

<h2 id="context">ApolloConsumer</h2>
With upcoming versions of React (starting in React 16.3), there is a new version of context that makes it easier than ever to use components connected to state higher in the tree. While the 2.1 doesn't require React 16.3, we are making it easier than ever to start writing in this style with the `<ApolloConsumer>` component. This is just like the `withApollo` higher order component, just in a normal React component! It takes no props and expects a child function which receives the instance of Apollo Client in your tree. For example:

```js
const MyClient = () => (
  <ApolloConsumer>
    {client => (
      <div>
        <h1>The current cache is:</h1>
        <pre>{client.extract()}</pre>
      </div>
    )}
  </ApolloConsumer>
);
```

For more usage tips on the ApolloConsumer component, checkout the guide [here](./essentials/local-state.html)

---

title: Get started
description: Learn how to quickly set up Apollo Client in your React app

---

The simplest way to get started with Apollo Client is by using Apollo Boost, our starter kit that configures your client for you with our recommended settings. Apollo Boost includes packages that we think are essential for building an Apollo app, like our in memory cache, local state management, and error handling. It's also flexible enough to handle features like authentication.

If you're an advanced user who would like to configure Apollo Client from scratch, head on over to our [Apollo Boost migration guide](../advanced/boost-migration.html). For the majority of users, Apollo Boost should meet your needs, so we don't recommend switching unless you absolutely need more customization.

<h2 id="installation">Installation</h2>

First, let's install some packages!

```bash
npm install apollo-boost react-apollo graphql
```

- `apollo-boost`: Package containing everything you need to set up Apollo Client
- `react-apollo`: View layer integration for React
- `graphql`: Also parses your GraphQL queries

> If you'd like to walk through this tutorial yourself, we recommend either running a new React project locally with [`create-react-app`](https://reactjs.org/docs/create-a-new-react-app.html) or creating a new React sandbox on [CodeSandbox](https://codesandbox.io/). For reference, we will be using [this CodeSandbox](https://codesandbox.io/s/48p1r2roz4) as our GraphQL server for our sample app, which pulls exchange rate data from the Coinbase API. If you'd like to skip ahead and see the app we're about to build, you can view it on [CodeSandbox](https://codesandbox.io/s/nn9y2wzyw4).

<h2 id="creating-client">Create a client</h2>

Great, now that you have all the dependencies you need, let's create your Apollo Client. The only thing you need to get started is the endpoint for your [GraphQL server](https://codesandbox.io/s/48p1r2roz4). If you don't pass in `uri` directly, it defaults to the `/graphql` endpoint on the same host your app is served from.

In our `index.js` file, let's import `ApolloClient` from `apollo-boost` and add the endpoint for our GraphQL server to the `uri` property of the client config object.

```js
import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  uri: "https://48p1r2roz4.sse.codesandbox.io"
});
```

That's it! Now your client is ready to start fetching data. Before we hook up Apollo Client to React, let's try sending a query with plain JavaScript first. In the same `index.js` file, try calling `client.query()`. Remember to first import the `gql` function for parsing your query string into a query document.

```js
import gql from "graphql-tag";

...

client
  .query({
    query: gql`
      {
        rates(currency: "USD") {
          currency
        }
      }
    `
  })
  .then(result => console.log(result));
```

Open up your console and inspect the result object. You should see a `data` property with `rates` attached, along with some other properties like `loading` and `networkStatus`. While you don't need React or another front-end framework just to fetch data with Apollo Client, our view layer integrations make it easier to bind your queries to your UI and reactively update your components with data. Let's learn how to connect Apollo Client to React so we can start building query components with `react-apollo`.

<h2 id="creating-provider">Connect your client to React</h2>

To connect Apollo Client to React, you will need to use the `ApolloProvider` component exported from `react-apollo`. The `ApolloProvider` is similar to React's [context provider](https://github.com/reactjs/rfcs/blob/master/text/0002-new-version-of-context.md). It wraps your React app and places the client on the context, which allows you to access it from anywhere in your component tree.

In `index.js`, let's wrap our React app with an `ApolloProvider`. We suggest putting the `ApolloProvider` somewhere high in your app, above any places where you need to access GraphQL data. For example, it could be outside of your root route component if you're using React Router.

```jsx
import React from "react";
import { render } from "react-dom";

import { ApolloProvider } from "react-apollo";

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <h2>My first Apollo app 🚀</h2>
    </div>
  </ApolloProvider>
);

render(<App />, document.getElementById("root"));
```

<h2 id="request">Request data</h2>

Once your `ApolloProvider` is hooked up, you're ready to start requesting data with `Query` components! `Query` is a React component exported from `react-apollo` that uses the [render prop pattern](https://reactjs.org/docs/render-props.html) to share GraphQL data with your UI.

First, pass your GraphQL query wrapped in the `gql` function to the `query` prop on the `Query` component. Then, you'll provide a function to the `Query` component's `children` prop to determine what to render, which `Query` will call with an object containing `loading`, `error`, and `data` properties. Apollo Client tracks error and loading state for you, which will be reflected in the `loading` and `error` properties. Once the result of your query comes back, it will be attached to the `data` property.

Let's create an `ExchangeRates` component in `index.js` to see the `Query` component in action!

```jsx
import { Query } from "react-apollo";
import gql from "graphql-tag";

const ExchangeRates = () => (
  <Query
    query={gql`
      {
        rates(currency: "USD") {
          currency
          rate
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return data.rates.map(({ currency, rate }) => (
        <div key={currency}>
          <p>
            {currency}: {rate}
          </p>
        </div>
      ));
    }}
  </Query>
);
```

Congrats, you just made your first `Query` component! 🎉 If you render your `ExchangeRates` component within your `App` component from the previous example, you'll first see a loading indicator and then data on the page once it's ready. Apollo Client automatically caches this data when it comes back from the server, so you won't see a loading indicator if you run the same query twice.

If you'd like to play around with the app we just built, you can view it on [CodeSandbox](https://codesandbox.io/s/nn9y2wzyw4). Don't stop there! Try building more `Query` components and experimenting with the concepts you just learned.

If you'd like to explore further, here are more versions of the example app featuring different front-end libraries:

- React Native Web: https://codesandbox.io/s/xk7zw3n4
- Vue: https://codesandbox.io/s/3vm8vq6kwq
- Angular (Ionic): https://github.com/aaronksaunders/ionicLaunchpadApp

<h2 id="apollo-boost">Apollo Boost</h2>

In our example app, we used Apollo Boost in order to quickly set up Apollo Client. While your GraphQL server endpoint is the only configuration option you need to get started, there are some other options we've included so you can quickly implement features like local state management, authentication, and error handling.

<h3 id="packages">What's included</h3>

Apollo Boost includes some packages that we think are essential to developing with Apollo Client. Here's what's included:

- `apollo-client`: Where all the magic happens
- `apollo-cache-inmemory`: Our recommended cache
- `apollo-link-http`: An Apollo Link for remote data fetching
- `apollo-link-error`: An Apollo Link for error handling
- `apollo-link-state`: An Apollo Link for local state management

The awesome thing about Apollo Boost is that you don't have to set any of this up yourself! Just specify a few options if you'd like to use these features and we'll take care of the rest.

<h3 id="configuration">Configuration options</h3>

Here are the options you can pass to the `ApolloClient` exported from `apollo-boost`. All of them are optional.

<dl>
  <dt>`uri`: string</dt>
  <dd>A string representing your GraphQL server endpoint. Defaults to `/graphql`</dd>
  <dt>`fetchOptions`: Object</dt>
  <dd>Any options you would like to pass to fetch (credentials, headers, etc). These options are static, so they don't change on each request.</dd>
  <dt>`request`: (operation: Operation) => Promise<void></dt>
  <dd>This function is called on each request. It takes a GraphQL operation and can return a promise. To dynamically set `fetchOptions`, you can add them to the context of the operation with `operation.setContext({ headers })`. Any options set here will take precedence over `fetchOptions`. Useful for authentication.</dd>
  <dt>`onError`: (errorObj: { graphQLErrors: GraphQLError[], networkError: Error, response?: ExecutionResult, operation: Operation }) => void</dt>
  <dd>We include a default error handler to log out your errors to the console. If you would like to handle your errors differently, specify this function.</dd>
  <dt>`clientState`: { resolvers?: Object, defaults?: Object, typeDefs?: string | Array<string> }</dt>
  <dd>An object representing your configuration for `apollo-link-state`. This is useful if you would like to use the Apollo cache for local state management. Learn more in our [quick start](/docs/link/links/state.html#start).</dd>
  <dt>`cacheRedirects`: Object</dt>
  <dd>A map of functions to redirect a query to another entry in the cache before a request takes place. This is useful if you have a list of items and want to use the data from the list query on a detail page where you're querying an individual item. More on that [here](../features/performance.html#cache-redirects).</dd>
  <dt>`credentials`: string</dt>
  <dd>Is set to `same-origin` by default. This option can be used to indicate whether the user agent should send cookies with requests. See [Request.credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials) for more details.</dd>
  <dt>`headers`: Object</dt>
  <dd>Header key/value pairs to pass along with the request.</dd>
  <dt>`fetch`: GlobalFetch['fetch']</dt>
  <dd>A [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) compatible API for making a request.</dd>  
  <dt>`cache`: ApolloCache</dt>
  <dd>A custom instance of `ApolloCache` to be used. The default value is `InMemoryCache` from `apollo-cache-inmemory`. This option is quite useful for using a custom cache with `apollo-cache-persist`.</dd>
</dl>

<h2 id="next-steps">Next steps</h2>

Now that you've learned how to fetch data with Apollo Client, you're ready to dive deeper into creating more complex queries and mutations. After this section, we recommend moving onto:

- [Queries](./queries.html): Learn how to fetch queries with arguments and dive deeper into configuration options. For a full list of options, check out the API reference for `Query`.
- [Mutations](./mutations.html): Learn how to update data with mutations and when you'll need to update the Apollo cache. For a full list of options, check out the API reference for `Mutation` components.
- [Apollo Client API](../api/apollo-client.html): Sometimes, you'll need to access the client directly like we did in our plain JavaScript example above. Visit the API reference for a full list of options.

---

title: Queries
description: Learn how to fetch data with Query components

---

Fetching data in a simple, predictable way is one of the core features of Apollo Client. In this guide, you'll learn how to build Query components in order to fetch GraphQL data and attach the result to your UI. You'll also learn how Apollo Client simplifies your data management code by tracking error and loading states for you.

This page assumes some familiarity with building GraphQL queries. If you'd like a refresher, we recommend [reading this guide](http://graphql.org/learn/queries/) and practicing [running queries in GraphiQL](../features/developer-tooling.html#features). Since Apollo Client queries are just standard GraphQL, you can be sure that any query that successfully runs in GraphiQL will also run in an Apollo Query component.

The following examples assume that you've already set up Apollo Client and have wrapped your React app in an `ApolloProvider` component. Read our [getting started](./get-started.html) guide if you need help with either of those steps.

> If you'd like to follow along with the examples, open up our [starter project](https://codesandbox.io/s/j2ly83749w) on CodeSandbox and our sample GraphQL server on [this CodeSandbox](https://codesandbox.io/s/32ypr38l61). You can view the completed version of the app [here](https://codesandbox.io/s/n3jykqpxwm).

<h2 id="basic">The Query component</h2>

The `Query` component is one of the most important building blocks of your Apollo application. To create a `Query` component, just pass a GraphQL query string wrapped with the `gql` function to `this.props.query` and provide a function to `this.props.children` that tells React what to render. The `Query` component is an example of a React component that uses the [render prop](https://reactjs.org/docs/render-props.html) pattern. React will call the render prop function you provide with an object from Apollo Client containing loading, error, and data properties that you can use to render your UI. Let's look at an example:

First, let's create our GraphQL query. Remember to wrap your query string in the `gql` function in order to parse it into a query document. Once we have our GraphQL query, let's attach it to our `Query` component by passing it to the `query` prop.

We also need to provide a function as a child to our `Query` component that will tell React what we want to render. We can use the `loading`, `error`, and `data` properties that the `Query` component provides for us in order to intelligently render different UI depending on the state of our query. Let's see what this looks like!

```jsx
import gql from "graphql-tag";
import { Query } from "react-apollo";

const GET_DOGS = gql`
  {
    dogs {
      id
      breed
    }
  }
`;

const Dogs = ({ onDogSelected }) => (
  <Query query={GET_DOGS}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;

      return (
        <select name="dog" onChange={onDogSelected}>
          {data.dogs.map(dog => (
            <option key={dog.id} value={dog.breed}>
              {dog.breed}
            </option>
          ))}
        </select>
      );
    }}
  </Query>
);
```

If you render `Dogs` within your `App` component, you'll first see a loading state and then a form with a list of dog breeds once Apollo Client receives the data from the server. When the form value changes, we're going to send the value to a parent component via `this.props.onDogSelected`, which will eventually pass the value to a `DogPhoto` component.

In the next step, we're going to hook our form up to a more complex query with variables by building a `DogPhoto` component.

<h2 id="data">Receiving data</h2>

You've already seen a preview of how to work with the result of your query in the render prop function. Let's dive deeper into what's happening behind the scenes with Apollo Client when we fetch data from a `Query` component.

1. When the `Query` component mounts, Apollo Client creates an observable for our query. Our component subscribes to the result of the query via the Apollo Client cache.
2. First, we try to load the query result from the Apollo cache. If it's not in there, we send the request to the server.
3. Once the data comes back, we normalize it and store it in the Apollo cache. Since the `Query` component subscribes to the result, it updates with the data reactively.

To see Apollo Client's caching in action, let's build our `DogPhoto` component. `DogPhoto` accepts a prop called `breed` that reflects the current value of our form from the `Dogs` component above.

```jsx
const GET_DOG_PHOTO = gql`
  query Dog($breed: String!) {
    dog(breed: $breed) {
      id
      displayImage
    }
  }
`;

const DogPhoto = ({ breed }) => (
  <Query query={GET_DOG_PHOTO} variables={{ breed }}>
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return `Error!: ${error}`;

      return (
        <img src={data.dog.displayImage} style={{ height: 100, width: 100 }} />
      );
    }}
  </Query>
);
```

You'll notice there is a new configuration option on our `Query` component. The prop `variables` is an object containing the variables we want to pass to our GraphQL query. In this case, we want to pass the breed from the form into our query.

Try selecting "bulldog" from the list to see its photo show up. Then, switch to another breed and switch back to "bulldog". You'll notice that the bulldog photo loads instantaneously the second time around. This is the Apollo cache at work!

Next, let's learn some techniques for ensuring our data is fresh, such as polling and refetching.

<h2 id="refetching">Polling and refetching</h2>

It's awesome that Apollo Client caches your data for you, but what should we do when we want fresh data? Two solutions are polling and refetching.

Polling can help us achieve near real-time data by causing the query to refetch on a specified interval. To implement polling, simply pass a `pollInterval` prop to the `Query` component with the interval in ms. If you pass in 0, the query will not poll. You can also implement dynamic polling by using the `startPolling` and `stopPolling` functions on the result object passed to the render prop function.

```jsx
const DogPhoto = ({ breed }) => (
  <Query
    query={GET_DOG_PHOTO}
    variables={{ breed }}
    skip={!breed}
    pollInterval={500}
  >
    {({ loading, error, data, startPolling, stopPolling }) => {
      if (loading) return null;
      if (error) return `Error!: ${error}`;

      return (
        <img src={data.dog.displayImage} style={{ height: 100, width: 100 }} />
      );
    }}
  </Query>
);
```

By setting the `pollInterval` to 500, you should see a new dog image every .5 seconds. Polling is an excellent way to achieve near-realtime data without the complexity of setting up GraphQL subscriptions.

What if you want to reload the query in response to a user action instead of an interval? That's where the `refetch` function comes in! Here, we're adding a button to our `DogPhoto` component that will trigger a refetch when clicked. `refetch` takes variables, but if we don't pass in new variables, it will use the same ones from our previous query.

```jsx
const DogPhoto = ({ breed }) => (
  <Query query={GET_DOG_PHOTO} variables={{ breed }} skip={!breed}>
    {({ loading, error, data, refetch }) => {
      if (loading) return null;
      if (error) return `Error!: ${error}`;

      return (
        <div>
          <img
            src={data.dog.displayImage}
            style={{ height: 100, width: 100 }}
          />
          <button onClick={() => refetch()}>Refetch!</button>
        </div>
      );
    }}
  </Query>
);
```

If you click the button, you'll notice that our UI updates with a new dog photo. Refetching is an excellent way to guarantee fresh data, but it introduces some added complexity with loading state. In the next section, you'll learn strategies to handle complex loading and error state.

<h2 id="loading">Loading and error state</h2>

We've already seen how Apollo Client exposes our query's loading and error state in the render prop function. These properties are helpful for when the query initially loads, but what happens to our loading state when we're refetching or polling?

Let's go back to our refetching example from the previous section. If you click on the refetch button, you'll see that the component doesn't re-render until the new data arrives. What if we want to indicate to the user that we're refetching the photo?

Luckily, Apollo Client provides fine-grained information about the status of our query via the `networkStatus` property on the result object in the render prop function. We also need to set the prop `notifyOnNetworkStatusChange` to true so our query component re-renders while a refetch is in flight.

```jsx
const DogPhoto = ({ breed }) => (
  <Query
    query={GET_DOG_PHOTO}
    variables={{ breed }}
    skip={!breed}
    notifyOnNetworkStatusChange
  >
    {({ loading, error, data, refetch, networkStatus }) => {
      if (networkStatus === 4) return "Refetching!";
      if (loading) return null;
      if (error) return `Error!: ${error}`;

      return (
        <div>
          <img
            src={data.dog.displayImage}
            style={{ height: 100, width: 100 }}
          />
          <button onClick={() => refetch()}>Refetch!</button>
        </div>
      );
    }}
  </Query>
);
```

The `networkStatus` property is an enum with number values from 1-8 representing a different loading state. 4 corresponds to a refetch, but there are also numbers for polling and pagination. For a full list of all the possible loading states, check out the [reference guide](../api/react-apollo.html#graphql-query-data-networkStatus).

While not as complex as loading state, responding to errors in your component is also customizable via the `errorPolicy` prop on the `Query` component. The default value for `errorPolicy` is "none" in which we treat all GraphQL errors as runtime errors. In the event of an error, Apollo Client will discard any data that came back with the request and set the `error` property in the render prop function to true. If you'd like to show any partial data along with any error information, set the `errorPolicy` to "all".

<h2 id="manual-query">Manually firing a query</h2>

When React mounts a `Query` component, Apollo Client automatically fires off your query. What if you wanted to delay firing your query until the user performs an action, such as clicking on a button? For this scenario, we want to use an `ApolloConsumer` component and directly call `client.query()` instead.

```jsx
import React, { Component } from "react";
import { ApolloConsumer } from "react-apollo";

class DelayedQuery extends Component {
  state = { dog: null };

  onDogFetched = dog => this.setState(() => ({ dog }));

  render() {
    return (
      <ApolloConsumer>
        {client => (
          <div>
            {this.state.dog && <img src={this.state.dog.displayImage} />}
            <button
              onClick={async () => {
                const { data } = await client.query({
                  query: GET_DOG_PHOTO,
                  variables: { breed: "bulldog" }
                });
                this.onDogFetched(data.dog);
              }}
            >
              Click me!
            </button>
          </div>
        )}
      </ApolloConsumer>
    );
  }
}
```

Fetching this way is quite verbose, so we recommend trying to use a `Query` component if at all possible!

> If you'd like to view a complete version of the app we just built, you can check out the CodeSandbox [here](https://codesandbox.io/s/n3jykqpxwm).

<h2 id="api">Query API overview</h2>

If you're looking for an overview of all the props `Query` accepts and its render prop function, look no further! Most `Query` components will not need all of these configuration options, but it's useful to know that they exist. If you'd like to learn about the `Query` component API in more detail with usage examples, visit our [reference guide](../api/react-apollo.html).

<h3 id="props">Props</h3>

The Query component accepts the following props. Only `query` and `children` are **required**.

<dl>
  <dt>`query`: DocumentNode</dt>
  <dd>A GraphQL query document parsed into an AST by `graphql-tag`. **Required**</dd>
  <dt>`children`: (result: QueryResult) => React.ReactNode</dt>
  <dd>A function returning the UI you want to render based on your query result. **Required**</dd>
  <dt>`variables`: { [key: string]: any }</dt>
  <dd>An object containing all of the variables your query needs to execute</dd>
  <dt>`pollInterval`: number</dt>
  <dd>Specifies the interval in ms at which you want your component to poll for data. Defaults to 0 (no polling).</dd>
  <dt>`notifyOnNetworkStatusChange`: boolean</dt>
  <dd>Whether updates to the network status or network error should re-render your component. Defaults to false.</dd>
  <dt>`fetchPolicy`: FetchPolicy</dt>
  <dd>How you want your component to interact with the Apollo cache. Defaults to "cache-first".</dd>
  <dt>`errorPolicy`: ErrorPolicy</dt>
  <dd>How you want your component to handle network and GraphQL errors. Defaults to "none", which means we treat GraphQL errors as runtime errors.</dd>
  <dt>`ssr`: boolean</dt>
  <dd>Pass in false to skip your query during server-side rendering.</dd>
  <dt>`displayName`: string</dt>
  <dd>The name of your component to be displayed in React DevTools. Defaults to 'Query'.</dd>
  <dt>`skip`: boolean</dt>
  <dd>If skip is true, the query will be skipped entirely.</dd>
  <dt>`onCompleted`: (data: TData | {}) => void</dt>
  <dd>A callback executed once your query successfully completes.</dd>
  <dt>`onError`: (error: ApolloError) => void</dt>
  <dd>A callback executed in the event of an error.</dd>
  <dt>`context`: Record<string, any></dt>
  <dd>Shared context between your Query component and your network interface (Apollo Link). Useful for setting headers from props or sending information to the `request` function of Apollo Boost.</dd>
  <dt>`partialRefetch`: boolean</dt>
  <dd>If `true`, perform a query `refetch` if the query result is marked as being partial, and the returned data is reset to an empty Object by the Apollo Client `QueryManager` (due to a cache miss). The default value is `false` for backwards-compatibility's sake, but should be changed to true for most use-cases.</dd>
</dl>

<h3 id="render-prop">Render prop function</h3>

The render prop function that you pass to the `children` prop of `Query` is called with an object (`QueryResult`) that has the following properties. This object contains your query result, plus some helpful functions for refetching, dynamic polling, and pagination.

<dl>
  <dt>`data`: TData</dt>
  <dd>An object containing the result of your GraphQL query. Defaults to an empty object.</dd>
  <dt>`loading`: boolean</dt>
  <dd>A boolean that indicates whether the request is in flight</dd>
  <dt>`error`: ApolloError</dt>
  <dd>A runtime error with `graphQLErrors` and `networkError` properties</dd>
  <dt>`variables`: { [key: string]: any }</dt>
  <dd>An object containing the variables the query was called with</dd>
  <dt>`networkStatus`: NetworkStatus</dt>
  <dd>A number from 1-8 corresponding to the detailed state of your network request. Includes information about refetching and polling status. Used in conjunction with the `notifyOnNetworkStatusChange` prop.</dd>
  <dt>`refetch`: (variables?: TVariables) => Promise<ApolloQueryResult></dt>
  <dd>A function that allows you to refetch the query and optionally pass in new variables</dd>
  <dt>`fetchMore`: ({ query?: DocumentNode, variables?: TVariables, updateQuery: Function}) => Promise<ApolloQueryResult></dt>
  <dd>A function that enables [pagination](../features/pagination.html) for your query</dd>
  <dt>`startPolling`: (interval: number) => void</dt>
  <dd>This function sets up an interval in ms and fetches the query each time the specified interval passes.</dd>
  <dt>`stopPolling`: () => void</dt>
  <dd>This function stops the query from polling.</dd>
  <dt>`subscribeToMore`: (options: { document: DocumentNode, variables?: TVariables, updateQuery?: Function, onError?: Function}) => () => void</dt>
  <dd>A function that sets up a [subscription](../advanced/subscriptions.html). `subscribeToMore` returns a function that you can use to unsubscribe.</dd>
  <dt>`updateQuery`: (previousResult: TData, options: { variables: TVariables }) => TData</dt>
  <dd>A function that allows you to update the query's result in the cache outside the context of a fetch, mutation, or subscription</dd>
  <dt>`client`: ApolloClient</dt>
  <dd>Your `ApolloClient` instance. Useful for manually firing queries or writing data to the cache.</dd>
</dl>

<h2 id="next-steps">Next steps</h2>

Learning how to build `Query` components to fetch data is one of the most important skills to mastering development with Apollo Client. Now that you're a pro at fetching data, why not try building `Mutation` components to update your data? Here are some resources we think will help you level up your skills:

- [Mutations](./mutations.html): Learn how to update data with mutations and when you'll need to update the Apollo cache. For a full list of options, check out the API reference for `Mutation` components.
- [Local state management](./local-state.html): Learn how to query local data with `apollo-link-state`.
- [Pagination](../features/pagination.html): Building lists has never been easier thanks to Apollo Client's `fetchMore` function. Learn more in our pagination tutorial.
- [Query component video by Sara Vieira](https://youtu.be/YHJ2CaS0vpM): If you need a refresher or learn best by watching videos, check out this tutorial on `Query` components by Sara!

---

title: Mutations
description: Learn how to update data with Mutation components

---

Now that we've learned how to fetch data with Apollo Client, what happens when we need to update that data? In this guide, you'll discover how to build Mutation components in order to send updates to your GraphQL server. You'll also learn how to update the Apollo cache after a mutation occurs and how to handle errors when things go wrong.

This page assumes some familiarity with building GraphQL mutations. If you'd like a refresher, we recommend [reading this guide](http://graphql.org/learn/queries/#mutations).

The following examples assume that you've already set up Apollo Client and have wrapped your React app in an `ApolloProvider` component. Read our [getting started](./get-started.html) guide if you need help with either of those steps. Let's dive in!

> If you'd like to follow along with the examples, open up our [starter project](https://codesandbox.io/s/znl94y0vp) on CodeSandbox, and our sample GraphQL server on [this CodeSandBox](https://codesandbox.io/s/plp0mopxq). You can view the completed version of the app [here](https://codesandbox.io/s/v3mn68xxvy).

<h2 id="basic">The Mutation component</h2>

The `Mutation` component is what you'll use to trigger mutations from your UI. To create a `Mutation` component, just pass a GraphQL mutation string wrapped with the `gql` function to `this.props.mutation` and provide a function to `this.props.children` that tells React what to render. The `Mutation` component is an example of a React component that uses the [render prop](https://reactjs.org/docs/render-props.html) pattern. React will call the render prop function you provide with a mutate function and an object with your mutation result containing loading, error, called, and data properties. Let's look at an example:

```jsx
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const ADD_TODO = gql`
  mutation AddTodo($type: String!) {
    addTodo(type: $type) {
      id
      type
    }
  }
`;

const AddTodo = () => {
  let input;

  return (
    <Mutation mutation={ADD_TODO}>
      {(addTodo, { data }) => (
        <div>
          <form
            onSubmit={e => {
              e.preventDefault();
              addTodo({ variables: { type: input.value } });
              input.value = "";
            }}
          >
            <input
              ref={node => {
                input = node;
              }}
            />
            <button type="submit">Add Todo</button>
          </form>
        </div>
      )}
    </Mutation>
  );
};
```

First, create your GraphQL mutation, wrap it in `gql`, and pass it to the `mutation` prop on the `Mutation` component. The `Mutation` component also requires a function as a child (also called the render prop function). The first argument of the render prop function is the mutate function, which you call to tell Apollo Client that you'd like to trigger a mutation. The mutate function optionally takes `variables`, `optimisticResponse`, `refetchQueries`, and `update`; however, you can also pass in those values as props to the `Mutation` component. In the example, notice how we use the mutate function (called `addTodo`) to submit the form with our variables.

The second argument to the render prop function is an object with your mutation result on the `data` property, as well as booleans for `loading` and if the mutate function was `called`, in addition to `error`. If you'd like to ignore the result of the mutation, pass `ignoreResults` as a prop to the mutation component.

If you're following along with the example on CodeSandbox, you probably noticed that the UI reflecting the list of todos did not update with our newly created todo when you submitted the form. This is because the todos query in the Apollo cache does not know about our newly created todo. In the next section, we'll learn when and how to update the Apollo cache after a mutation.

<h2 id="update">Updating the cache</h2>

Sometimes when you perform a mutation, your GraphQL server and your Apollo cache become out of sync. This happens when the update you're performing depends on data that is already in the cache; for example, deleting and adding items to a list. We need a way to tell Apollo Client to update the query for the list of items. This is where the `update` function comes in! `update` functions aren't required to update the cache for all mutations, but our `addTodo` mutation is an example of where it comes in handy.

The update function is called with the Apollo cache as the first argument. The cache has several utility functions such as `cache.readQuery` and `cache.writeQuery` that allow you to read and write queries to the cache with GraphQL as if it were a server.
There are other cache methods, such as `cache.readFragment`, `cache.writeFragment`, and `cache.writeData`, which you can learn about in our detailed [caching guide](../advanced/caching.html) if you're curious.

The second argument to the update function is an object with a data property containing your mutation result. If you specify an [optimistic response](../features/optimistic-ui.html), your update function will be called twice: once with your optimistic result, and another time with your actual result. You can use your mutation result to update the cache with `cache.writeQuery`.

Now that we've learned about the update function, let's implement one for the `Mutation` component we just built!

```jsx
const GET_TODOS = gql`
  query GetTodos {
    todos
  }
`;

const AddTodo = () => {
  let input;

  return (
    <Mutation
      mutation={ADD_TODO}
      update={(cache, { data: { addTodo } }) => {
        const { todos } = cache.readQuery({ query: GET_TODOS });
        cache.writeQuery({
          query: GET_TODOS,
          data: { todos: todos.concat([addTodo]) }
        });
      }}
    >
      {addTodo => (
        <div>
          <form
            onSubmit={e => {
              e.preventDefault();
              addTodo({ variables: { type: input.value } });
              input.value = "";
            }}
          >
            <input
              ref={node => {
                input = node;
              }}
            />
            <button type="submit">Add Todo</button>
          </form>
        </div>
      )}
    </Mutation>
  );
};
```

You can pass the `update` function as a prop to `Mutation` or as an option to the mutate function (`addTodo` in this example). Since we need to update the query that displays a list of todos, first we read the data from the cache with `cache.readQuery`. Then, we concatenate our new todo from our mutation with the list of existing todos and write the query back to the cache with `cache.writeQuery`. Now that we've specified an update function, our UI will update reactively with the new todo once it comes back from the server.

Not every mutation requires an update function. If you're updating a single item, you usually don't need an update function as long as you return the item's `id` and the property you updated. While this may seem like magic, this is actually a benefit of Apollo's normalized cache, which splits out each object with an `id` into its own entity in the cache. Let's look at an example:

```jsx
const UPDATE_TODO = gql`
  mutation UpdateTodo($id: String!, $type: String!) {
    updateTodo(id: $id, type: $type) {
      id
      type
    }
  }
`;

const Todos = () => (
  <Query query={GET_TODOS}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return data.todos.map(({ id, type }) => {
        let input;

        return (
          <Mutation mutation={UPDATE_TODO} key={id}>
            {updateTodo => (
              <div>
                <p>{type}</p>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    updateTodo({ variables: { id, type: input.value } });

                    input.value = "";
                  }}
                >
                  <input
                    ref={node => {
                      input = node;
                    }}
                  />
                  <button type="submit">Update Todo</button>
                </form>
              </div>
            )}
          </Mutation>
        );
      });
    }}
  </Query>
);
```

If you try updating a todo, you'll notice that the UI updates immediately. Even though we don't plan on using the mutation return result in our UI, we still need to return the `id` and the property we updated in order for our UI to update reactively. Here, we don't need to specify an update function since the todos query will automatically reconstruct the query result with the updated todo's entry in the cache. If you'd like to dive deeper into the Apollo cache's normalization strategy, check out our advanced [caching guide](../advanced/caching.html).

<h2 id="errors">Loading and error state</h2>

How do we know that our mutation has completed? What happens when your mutation doesn't complete successfully? We need a way to track loading and error state. Luckily, the Mutation component allows you to do just that. Let's look at the `Todos` component from the previous example:

```jsx
const Todos = () => (
  <Query query={GET_TODOS}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return data.todos.map(({ id, type }) => {
        let input;

        return (
          <Mutation mutation={UPDATE_TODO} key={id}>
            {(updateTodo, { loading, error }) => (
              <div>
                <p>{type}</p>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    updateTodo({ variables: { id, type: input.value } });

                    input.value = "";
                  }}
                >
                  <input
                    ref={node => {
                      input = node;
                    }}
                  />
                  <button type="submit">Update Todo</button>
                </form>
                {loading && <p>Loading...</p>}
                {error && <p>Error :( Please try again</p>}
              </div>
            )}
          </Mutation>
        );
      });
    }}
  </Query>
```

In the render prop function, we can destructure `loading` and `error` properties off the mutation result in order to track the state of our mutation in our UI. The `Mutation` component also has `onCompleted` and `onError` props in case you would like to provide callbacks instead. Additionally, the mutation result object also has a `called` boolean that tracks whether or not the mutate function has been called.

<h2 id="api">Mutation API overview</h2>

If you're looking for an overview of all the props `Mutation` accepts and its render prop function, look no further! Most `Mutation` components will not need all of these configuration options, but it's useful to know that they exist. If you'd like to learn about the `Mutation` component API in more detail with usage examples, visit our [reference guide](../api/react-apollo.html).

<h3 id="props">Props</h3>

The Mutation component accepts the following props. Only `mutation` and `children` are **required**.

<dl>
  <dt>`mutation`: DocumentNode</dt>
  <dd>A GraphQL mutation document parsed into an AST by `graphql-tag`. **Required**</dd>
  <dt>`children`: (mutate: Function, result: MutationResult) => React.ReactNode</dt>
  <dd>A function that allows you to trigger a mutation from your UI. **Required**</dd>
  <dt>`variables`: { [key: string]: any }</dt>
  <dd>An object containing all of the variables your mutation needs to execute</dd>
  <dt>`update`: (cache: DataProxy, mutationResult: FetchResult)</dt>
  <dd>A function used to update the cache after a mutation occurs</dd>
  <dt>`ignoreResults`: boolean</dt>
  <dd>If true, the `data` property on the render prop function will not update with the mutation result.</dd>
  <dt>`optimisticResponse`: Object</dt>
  <dd>Provide a [mutation response](../features/optimistic-ui.html) before the result comes back from the server</dd>
  <dt>`refetchQueries`: (mutationResult: FetchResult) => Array<{ query: DocumentNode, variables?: TVariables} | string></dt>
  <dd>A function that allows you to specify which queries you want to refetch after a mutation has occurred</dd>
  <dt>`awaitRefetchQueries`: boolean</dt>
  <dd>Queries refetched as part of `refetchQueries` are handled asynchronously, and are not waited on before the mutation is completed (resolved). Setting this to `true` will make sure refetched queries are completed before the mutation is considered done. `false` by default.</dd>
  <dt>`onCompleted`: (data: TData) => void</dt>
  <dd>A callback executed once your mutation successfully completes</dd>
  <dt>`onError`: (error: ApolloError) => void</dt>
  <dd>A callback executed in the event of an error</dd>
  <dt>`context`: Record<string, any></dt>
  <dd>Shared context between your Mutation component and your network interface (Apollo Link). Useful for setting headers from props or sending information to the `request` function of Apollo Boost.</dd>
</dl>

<h3 id="render-prop">Render prop function</h3>

The render prop function that you pass to the `children` prop of `Mutation` is called with the `mutate` function and an object with the mutation result. The `mutate` function is how you trigger the mutation from your UI. The object contains your mutation result, plus loading and error state.

**Mutate function:**

<dl>
  <dt>`mutate`: (options?: MutationOptions) => Promise<FetchResult></dt>
  <dd>A function to trigger a mutation from your UI. You can optionally pass `variables`, `optimisticResponse`, `refetchQueries`, and `update` in as options, which will override any props passed to the `Mutation` component. The function returns a promise that fulfills with your mutation result.</dd>
</dl>

**Mutation result:**

<dl>
  <dt>`data`: TData</dt>
  <dd>The data returned from your mutation. It can be undefined if `ignoreResults` is true.</dd>
  <dt>`loading`: boolean</dt>
  <dd>A boolean indicating whether your mutation is in flight</dd>
  <dt>`error`: ApolloError</dt>
  <dd>Any errors returned from the mutation</dd>
  <dt>`called`: boolean</dt>
  <dd>A boolean indicating if the mutate function has been called</dd>
  <dt>`client`: ApolloClient</dt>
  <dd>Your `ApolloClient` instance. Useful for invoking cache methods outside the context of the update function, such as `client.writeData` and `client.readQuery`.</dd>
</dl>

<h2 id="next-steps">Next steps</h2>

Learning how to build `Mutation` components to update your data is an important part of developing applications with Apollo Client. Now that you're well-versed in updating data, why not try executing client-side mutations with `apollo-link-state`? Here are some resources we think will help you level up your skills:

- [Optimistic UI](../features/optimistic-ui.html): Learn how to improve perceived performance by returning an optimistic response before your mutation result comes back from the server.
- [Local state](./local-state.html): Manage your local state with Apollo by executing client-side mutations with `apollo-link-state`.
- [Caching in Apollo](../advanced/caching.html): Dive deep into the Apollo cache and how it's normalized in our advanced guide on caching. Understanding the cache is helpful when writing your mutation's `update` function!
- [Mutation component video by Sara Vieira](https://youtu.be/2SYa0F50Mb4): If you need a refresher or learn best by watching videos, check out this tutorial on `Mutation` components by Sara!

---

title: Local state management
description: Learn how to work with your local data in Apollo Client

---

We've learned how to manage remote data from our GraphQL server with Apollo Client, but what should we do with our local data? We want to be able to access boolean flags and device API results from multiple components in our app, but don't want to maintain a separate Redux or MobX store. Ideally, we would like the Apollo cache to be the single source of truth for all data in our client application.

Apollo Client (>= 2.5) has built-in local state handling capabilities, that allow you to store your local data inside the Apollo cache alongside your remote data. To access your local data, just query it with GraphQL. You can even request local and server data within the same query!

In this section, you'll learn how Apollo Client can help simplify local state management in your app. We'll cover how client-side resolvers can help us execute local queries and mutations. You'll also learn how to query and update the cache with the `@client` directive.

Please note that this documentation is intended to be used to familiarize yourself with Apollo Client's local state management capabilities, and serve as a reference guide. If you're looking for a step by step tutorial outlining how to handle local state with Apollo Client (and leverage other Apollo components to build a fullstack application), please refer to the [Apollo tutorial](https://www.apollographql.com/docs/tutorial/introduction.html).

> ⚠️ If you're interested in integrating local state handling capabilities with Apollo Client < 2.5, please refer to our (now deprecated) [`apollo-link-state`](https://github.com/apollographql/apollo-link-state) project. As of Apollo Client 2.5, local state handling is baked into the core, which means it is no longer necessary to use `apollo-link-state`. For help migrating from `apollo-link-state` to Apollo Client 2.5, please refer to the [Migrating from `apollo-link-state`](#migrating) section.

<h2 id="updating-local-state">Updating local state</h2>

There are two main ways to perform local state mutations. The first way is to directly write to the cache by calling `cache.writeData`. Direct writes are great for one-off mutations that don't depend on the data that's currently in the cache, such as writing a single value. The second way is by creating a `Mutation` component with a GraphQL mutation that calls a local client-side resolver. We recommend using resolvers if your mutation depends on existing values in the cache, such as adding an item to a list or toggling a boolean.

<h3 id="direct-writes">Direct writes</h3>

Direct writes to the cache do not require a GraphQL mutation or a resolver function. They leverage your Apollo Client instance directly by accessing the `client` property within the render prop function of the `ApolloConsumer` or `Query` components. We recommend using this strategy for simple writes, such as writing a string, or one-off writes. It's important to note that direct writes are not implemented as GraphQL mutations under the hood, so you shouldn't include them in your schema. They also do not validate that the data you're writing to the cache is in the shape of valid GraphQL data. If either of these features are important to you, you should opt to use a local resolver instead.

Here's a direct write example using the `ApolloConsumer` component:

```jsx
import React from "react";
import { ApolloConsumer } from "react-apollo";

import Link from "./Link";

const FilterLink = ({ filter, children }) => (
  <ApolloConsumer>
    {client => (
      <Link
        onClick={() => client.writeData({ data: { visibilityFilter: filter } })}
      >
        {children}
      </Link>
    )}
  </ApolloConsumer>
);
```

The `ApolloConsumer` render prop function is called with a single value, the Apollo Client instance. You can think of the `ApolloConsumer` component as being similar to the `Consumer` component from the [React context API](https://reactjs.org/docs/context.html). From the client instance, you can directly call `client.writeData` and pass in the data you'd like to write to the cache.

What if we want to immediately subscribe to the data we just wrote to the cache? Let's create an `active` property on the link that marks the link's filter as active if it's the same as the current `visibilityFilter` in the cache. To immediately subscribe to a client-side mutation, wrap it in a `Query` component instead of an `ApolloConsumer` component. The `Query` component also has the client instance exposed to its render prop function.

```jsx
import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Link from "./Link";

const GET_VISIBILITY_FILTER = gql`
  {
    visibilityFilter @client
  }
`;

const FilterLink = ({ filter, children }) => (
  <Query query={GET_VISIBILITY_FILTER}>
    {({ data, client }) => (
      <Link
        onClick={() => client.writeData({ data: { visibilityFilter: filter } })}
        active={data.visibilityFilter === filter}
      >
        {children}
      </Link>
    )}
  </Query>
);
```

You'll notice in our query that we have a `@client` directive next to our `visibilityFilter` field. This tells Apollo Client to fetch the field data locally (either from the cache or using a local resolver), instead of sending it to our GraphQL server. Once you call `client.writeData`, the query result on the render prop function will automatically update. All cache writes and reads are synchronous, so you don't have to worry about loading state.

<h3 id="local-resolvers">Local resolvers</h3>

If you'd like to implement your local state update as a GraphQL mutation, then you'll need to specify a function in your local resolver map. The resolver map is an object with resolver functions for each GraphQL object type. To visualize how this all lines up, it's useful to think of a GraphQL query or mutation as a tree of function calls for each field. These function calls resolve to data or another function call. So when a GraphQL query is run through Apollo Client, it looks for a way to essentially run functions for each field in the query. When it finds an `@client` directive on a field, it turns to its internal resolver map looking for a function it can run for that field.

To help make local resolvers more flexible, the signature of a resolver function is the exact same as resolver functions on the server built with [Apollo Server](docs/apollo-server/essentials/data.html). Let's recap the four parameters of a resolver function:

```js
fieldName: (obj, args, context, info) => result;
```

1. `obj`: The object containing the result returned from the resolver on the parent field or the `ROOT_QUERY` object in the case of a top-level query or mutation.
2. `args`: An object containing all of the arguments passed into the field. For example, if you called a mutation with `updateNetworkStatus(isConnected: true)`, the `args` object would be `{ isConnected: true }`.
3. `context`: An object of contextual information shared between your React components and your Apollo Client network stack. In addition to any custom context properties that may be present, local resolvers always receive the following:
   - `context.client`: The Apollo Client instance.
   - `context.cache`: The Apollo Cache instance, which can be used to manipulate the cache with `context.cache.readQuery`, `.writeQuery`, `.readFragment`, `.writeFragment`, and `.writeData`. You can learn more about these methods in [Managing the cache](#managing-the-cache).
   - `context.getCacheKey`: Get a key from the cache using a `__typename` and `id`.
4. `info`: Information about the execution state of the query. You will probably never have to use this one.

Let's take a look at an example of a resolver where we toggle a todo's completed status:

```js
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  resolvers: {
    Mutation: {
      toggleTodo: (_root, variables, { cache, getCacheKey }) => {
        const id = getCacheKey({ __typename: "TodoItem", id: variables.id });
        const fragment = gql`
          fragment completeTodo on TodoItem {
            completed
          }
        `;
        const todo = cache.readFragment({ fragment, id });
        const data = { ...todo, completed: !todo.completed };
        cache.writeData({ id, data });
        return null;
      }
    }
  }
});
```

In order to toggle the todo's completed status, we first need to query the cache to find out what the todo's current completed status is. We do this by reading a fragment from the cache with `cache.readFragment`. This function takes a fragment and an id, which corresponds to the todo item's cache key. We get the cache key by calling the `getCacheKey` that's on the context and passing in the item's `__typename` and `id`.

Once we read the fragment, we toggle the todo's completed status and write the updated data back to the cache. Since we don't plan on using the mutation's return result in our UI, we return null since all GraphQL types are nullable by default.

Let's learn how to trigger our `toggleTodo` mutation from our component:

```jsx
import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: Int!) {
    toggleTodo(id: $id) @client
  }
`;

const Todo = ({ id, completed, text }) => (
  <Mutation mutation={TOGGLE_TODO} variables={{ id }}>
    {toggleTodo => (
      <li
        onClick={toggleTodo}
        style={{
          textDecoration: completed ? "line-through" : "none"
        }}
      >
        {text}
      </li>
    )}
  </Mutation>
);
```

First, we create a GraphQL mutation that takes the todo's id we want to toggle as its only argument. We indicate that this is a local mutation by marking the field with a `@client` directive. This will tell Apollo Client to call our local `toggleTodo` mutation resolver in order to resolve the field. Then, we create a `Mutation` component just as we would for a remote mutation. Finally, pass in your GraphQL mutation to your component and trigger it from within the UI in your render prop function.

<h2 id="querying-local-state">Querying local state</h2>

Querying for local data is very similar to querying your GraphQL server. The only difference is that you add a `@client` directive on your local fields to indicate they should be resolved from the Apollo Client cache or a local resolver function. Let's look at an example:

```jsx
import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Todo from "./Todo";

const GET_TODOS = gql`
  {
    todos @client {
      id
      completed
      text
    }
    visibilityFilter @client
  }
`;

const TodoList = () => (
  <Query query={GET_TODOS}>
    {({ data: { todos, visibilityFilter } }) => (
      <ul>
        {getVisibleTodos(todos, visibilityFilter).map(todo => (
          <Todo key={todo.id} {...todo} />
        ))}
      </ul>
    )}
  </Query>
);
```

Here we create our GraphQL query and add `@client` directives to `todos` and `visibilityFilter`. We then pass the query to our `Query` component. The `@client` directives here let the `Query` component know that `todos` and `visibilityFilter` should be pulled from the Apollo Client cache or resolved using pre-defined local resolvers. The following sections help explain how both options work in more detail.

> ⚠️ Since the above query runs as soon as the component is mounted, what do we do if there are no todos in the cache or there aren't any local resolvers defined to help calculate `todos`? We need to write an initial state to the cache before the query is run to prevent it from erroring out. Refer to the [Initializing the cache](#cache-initialization) section below for more information.

<h3 id="cache-initialization">Initializing the cache</h3>

Often, you'll need to write an initial state to the cache so any components querying data before a mutation is triggered don't error out. To accomplish this, you can use `cache.writeData` to prep the cache with initial values. The shape of your initial state should match how you plan to query it in your application.

```js
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";

const cache = new InMemoryCache();
const client = new ApolloClient({
  cache,
  resolvers: {
    /* ... */
  }
});

cache.writeData({
  data: {
    todos: [],
    visibilityFilter: "SHOW_ALL",
    networkStatus: {
      __typename: "NetworkStatus",
      isConnected: false
    }
  }
});
```

Sometimes you may need to [reset the store](/docs/react/features/cache-updates.html#reset-store) in your application, when a user logs out for example. If you call `client.resetStore` anywhere in your application, you will likely want to initialize your cache again. You can do this using the `client.onResetStore` method to register a callback that will call `cache.writeData` again.

```js
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";

const cache = new InMemoryCache();
const client = new ApolloClient({
  cache,
  resolvers: {
    /* ... */
  }
});

const data = {
  todos: [],
  visibilityFilter: "SHOW_ALL",
  networkStatus: {
    __typename: "NetworkStatus",
    isConnected: false
  }
};

cache.writeData({ data });

client.onResetStore(() => cache.writeData({ data }));
```

<h3 id="query-flow">Local data query flow</h3>

When a query containing `@client` directives is executed, Apollo Client runs through a few sequential steps to try to find a result for the `@client` field. Let's use the following query to walk through the local data look up flow:

```js
const GET_LAUNCH_DETAILS = gql`
  query LaunchDetails($launchId: ID!) {
    launch(id: $launchId) {
      isInCart @client
      site
      rocket {
        type
      }
    }
  }
`;
```

This query includes a mixture of both remote and local fields. `isInCart` is the only field marked with an `@client` directive, so it's the field we'll focus on. When Apollo Client executes this query and tries to find a result for the `isInCart` field, it runs through the following steps:

1. Has a resolver function been set (either through the `ApolloClient` constructor `resolvers` parameter or Apollo Client's `setResolvers` / `addResolvers` methods) that is associated with the field name `isInCart`? If yes, run and return the result from the resolver function.

2. If a matching resolver function can't be found, check the Apollo Client cache to see if a `isInCart` value can be found directly. If so, return that value.

Let's look at both of these steps more closely.

- Resolving `@client` data with the help of local resolvers (step 1 above) is explained in [Handling `@client` fields with resolvers](#client-fields-resolvers).
- Loading `@client` data from the cache (step 2 above) is explained in [Handling `@client` fields with the cache](#client-fields-cache).

<h3 id="client-fields-resolvers">Handling `@client` fields with resolvers</h3>

Local resolvers are very similar to remote resolvers. Instead of sending your GraphQL query to a remote GraphQL endpoint, which then runs resolver functions against your query to populate and return a result set, Apollo Client runs locally defined resolver functions against any fields marked with the `@client` directive. Let's look at an example:

```js
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';

const GET_CART_ITEMS = gql`
  query GetCartItems {
    cartItems @client
  }
`;

const cache = new InMemoryCache(),
const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
  }),
  resolvers: {
    Launch: {
      isInCart: (launch, _args, { cache }) => {
        const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS });
        return cartItems.includes(launch.id);
      },
    },
  },
});

cache.writeData({
  data: {
    cartItems: [],
  },
});

const GET_LAUNCH_DETAILS = gql`
  query LaunchDetails($launchId: ID!) {
    launch(id: $launchId) {
      isInCart @client
      site
      rocket {
        type
      }
    }
  }
`;

// ... run the query using client.query, a <Query /> component, etc.
```

Here when the `GET_LAUNCH_DETAILS` query is executed, Apollo Client looks for a local resolver associated with the `isInCart` field. Since we've defined a local resolver for the `isInCart` field in the `ApolloClient` constructor, it finds a resolver it can use. This resolver function is run, then the result is calculated and merged in with the rest of the query result (if a local resolver can't be found, Apollo Client will check the cache for a matching field - see [Local data query flow](#query-flow) for more details).

Setting resolvers through `ApolloClient`'s constructor `resolvers` parameter, or through its `setResolvers` / `addResolvers` methods, adds resolvers to Apollo Client's internal resolver map (refer to the [Local resolvers](#local-resolvers) section for more details concerning the resolver map). In the above example we added a `isInCart` resolver, for the `Launch` GraphQL object type, to the resolver map. Let's look at the `isInCart` resolver function more closely:

```js
  resolvers: {
    Launch: {
      isInCart: (launch, _args, { cache }) => {
        const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS });
        return cartItems.includes(launch.id);
      },
    },
  },
```

`launch` holds the data returned from the server for the rest of the query, which means in this case we can use `launch` to get the current launch `id`. We aren't using any arguments in this resolver, so we can skip the second resolver parameter. From the `context` however (the third parameter), we're using the `cache` reference, to work directly with the cache ourselves. So in this resolver, we're making a call directly to the cache to get all cart items, checking to see if any of those loaded cart items matches the parent `launch.id`, and returning `true` / `false` accordingly. The returned boolean is then incorporated back into the result of running the original query.

Just like resolvers on the server, local resolvers are extremely flexible. They can be used to perform any kind of local computation you want, before returning a result for the specified field. You can manually query (or write to) the cache in different ways, call other helper utilities or libraries to prep/validate/clean data, track statistics, call into other data stores to prep a result, etc.

<h4 id="client-with-remote-queries">Integrating `@client` into remote queries</h4>

While Apollo Client’s local state handling features can be used to work with local state exclusively, most Apollo based applications are built to work with remote data sources. To address this, Apollo Client supports mixing `@client` based local resolvers with remote queries, as well as using `@client` based fields as arguments to remote queries, in the same request.

The `@client` directive can be used on any GraphQL selection set or field, to identify that the result of that field should be loaded locally with the help of a local resolver:

```js
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";

const MEMBER_DETAILS = gql`
  query Member {
    member {
      name
      role
      isLoggedIn @client
    }
  }
`;

const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:4000/graphql" }),
  cache: new InMemoryCache(),
  resolvers: {
    Member: {
      isLoggedIn() {
        return someInternalLoginVerificationFunction();
      }
    }
  }
});

// ... run the query using client.query, the <Query /> component, etc.
```

When the above `MEMBER_DETAILS` query is fired by Apollo Client (assuming we're talking to a network based GraphQL API), the `@client` `isLoggedIn` field is first stripped from the document, and the remaining query is sent over the network to the GraphQL API. After the query has been handled by the remote resolvers and the result is passed back to Apollo Client from the API, the `@client` parts of the original query are then run against any defined local resolvers, their results are merged with the network results, and the final resulting data is returned as the response to the original operation. So in the above example, `isLoggedIn` is stripped before the rest of the query is sent and handled by the network API, then when the results come back `isLoggedIn` is calculated by running the `isLoggedIn()` function from the resolver map. Local and network results are merged together, and the final response is made available to the application.

The `@client` directive can be used with entire selection sets as well:

```js
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";

const MEMBER_DETAILS = gql`
  query Member {
    member {
      name
      role
      session @client {
        isLoggedIn
        connectionCount
        errors
      }
    }
  }
`;

const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:4000/graphql" }),
  cache: new InMemoryCache(),
  resolvers: {
    Member: {
      session() {
        return {
          __typename: "Session",
          isLoggedIn: someInternalLoginVerificationFunction(),
          connectionCount: calculateOpenConnections(),
          errors: sessionError()
        };
      }
    }
  }
});
```

Apollo Client supports the merging of local `@client` results and remote results for Queries, Mutations and Subscriptions.

<h4 id="async-resolvers">Async local resolvers</h4>

Apollo Client supports asynchronous local resolver functions. These functions can either be `async` functions or ordinary functions that return a `Promise`. Asynchronous resolvers are useful when they need to return data from an asynchronous API.

> ⚠️ If you would like to hit a REST endpoint from your resolver, [we recommend checking out `apollo-link-rest`](https://github.com/apollographql/apollo-link-rest) instead, which is a more complete solution for using REST endpoints with Apollo Client.

For React Native and most browser APIs, you should set up a listener in a component lifecycle method and pass in your mutation trigger function as the callback instead of using an async resolver. However, an `async` resolver function is often the most convenient way to consume asynchronous device APIs:

```js
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { CameraRoll } from "react-native";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  resolvers: {
    Query: {
      async cameraRoll(_, { assetType }) {
        try {
          const media = await CameraRoll.getPhotos({
            first: 20,
            assetType
          });

          return {
            ...media,
            id: assetType,
            __typename: "CameraRoll"
          };
        } catch (e) {
          console.error(e);
          return null;
        }
      }
    }
  }
});
```

[`CameraRoll.getPhotos()`](https://facebook.github.io/react-native/docs/cameraroll.html#getphotos) returns a `Promise` resolving to an object with a `edges` property, which is an array of camera node objects, and a `page_info` property, which is an object with pagination information. This is a great use case for GraphQL, since we can filter down the return value to only the data that our components consume.

```js
import gql from "graphql-tag";

const GET_PHOTOS = gql`
  query getPhotos($assetType: String!) {
    cameraRoll(assetType: $assetType) @client {
      id
      edges {
        node {
          image {
            uri
          }
          location {
            latitude
            longitude
          }
        }
      }
    }
  }
`;
```

<h3 id="client-fields-cache">Handling `@client` fields with the cache</h3>

As outlined in [Handling `@client` fields with resolvers](#client-fields-resolvers), `@client` fields can be resolved with the help of local resolver functions. However, it's important to note that local resolvers are not always required when using an `@client` directive. Fields marked with `@client` can still be resolved locally, by pulling matching values out of the cache directly. For example:

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { Query, ApolloProvider } from "react-apollo";
import gql from "graphql-tag";

import Pages from "./pages";
import Login from "./pages/login";

const cache = new InMemoryCache();
const client = new ApolloClient({
  cache,
  link: new HttpLink({ uri: "http://localhost:4000/graphql" }),
  resolvers: {}
});

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem("token")
  }
});

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

ReactDOM.render(
  <ApolloProvider client={client}>
    <Query query={IS_LOGGED_IN}>
      {({ data }) => (data.isLoggedIn ? <Pages /> : <Login />)}
    </Query>
  </ApolloProvider>,
  document.getElementById("root")
);
```

In the above example, we first prep the cache using `cache.writeData` to store a value for the `isLoggedIn` field. We then run the `IS_LOGGED_IN` query via a React Apollo `Query` component, which includes an `@client` directive. When Apollo Client executes the `IS_LOGGED_IN` query, it first looks for a local resolver that can be used to handle the `@client` field. When it can't find one, it falls back on trying to pull the specified field out of the cache. So in this case, the `data` value passed into the `Query` component's render prop has a `isLoggedIn` property available, which includes the `isLoggedIn` result (`!!localStorage.getItem('token')`) pulled directly from the cache.

> ⚠️ If you want to use Apollo Client's `@client` support to query the cache without using local resolvers, you must pass an empty object into the `ApolloClient` constructor `resolvers` option. Without this Apollo Client will not enable its integrated `@client` support, which means your `@client` based queries will be passed to the Apollo Client link chain. You can find more details about why this is necessary [here](https://github.com/apollographql/apollo-client/pull/4499).

Pulling `@client` field values directly out of the cache isn't quite as flexible as local resolver functions, since local resolvers can perform extra computations before returning a result. Depending on your application's needs however, loading `@client` fields directly from the cache might be a simpler option. Apollo Client doesn't restrict combining both approaches, so feel free to mix and match. If the need arises, you can pull some `@client` values from the cache, and resolve others with local resolvers, all in the same query.

<h3 id="fetch-policy">Working with fetch policies</h3>

Before Apollo Client executes a query, one of the first things it does is check to see which [`fetchPolicy`](../api/apollo-client.html#ApolloClient.query) it has been configured to use. It does this so it knows where it should attempt to resolve the query from first, either the cache or the network. When running a query, Apollo Client treats `@client` based local resolvers just like it does remote resolvers, in that it will adhere to its defined `fetchPolicy` to know where to attempt to pull data from first. When working with local resolvers, it's important to understand how fetch policies impact the running of resolver functions, since by default local resolver functions are not run on every request. This is because the result of running a local resolver is cached with the rest of the query result, and pulled from the cache on the next request. Let's look at an example:

```jsx
import React, { Fragment } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import { Loading, Header, LaunchDetail } from "../components";
import { ActionButton } from "../containers";

export const GET_LAUNCH_DETAILS = gql`
  query LaunchDetails($launchId: ID!) {
    launch(id: $launchId) {
      isInCart @client
      site
      rocket {
        type
      }
    }
  }
`;

export default function Launch({ launchId }) {
  return (
    <Query query={GET_LAUNCH_DETAILS} variables={{ launchId }}>
      {({ data, loading, error }) => {
        if (loading) return <Loading />;
        if (error) return <p>ERROR: {error.message}</p>;

        return (
          <Fragment>
            <Header image={data.launch.mission.missionPatch}>
              {data.launch.mission.name}
            </Header>
            <LaunchDetail {...data.launch} />
            <ActionButton {...data.launch} />
          </Fragment>
        );
      }}
    </Query>
  );
}
```

In the above example we're using a React Apollo `Query` component to run the `GET_LAUNCH_DETAILS` query. The `@client` based `isInClient` field is configured to pull its data from the following resolver:

```js
import { GET_CART_ITEMS } from "./pages/cart";

export const resolvers = {
  Launch: {
    isInCart: (launch, _, { cache }) => {
      const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS });
      return cartItems.includes(launch.id);
    }
  }
};
```

Let's assume we're starting with an empty cache. Since we haven't specified a `fetchPolicy` prop in our `Query` call, we're using Apollo Client's default `cache-and-network` `fetchPolicy`. This means when the `GET_LAUNCH_DETAILS` query is run, it checks the cache first to see if it can find a result. It's important to note that when the cache is checked the entire query is run against the cache, but any `@client` associated local resolvers are skipped (not run). So the cache is queried with the following (it's as if the `@client` directive was never specified):

```
launch(id: $launchId) {
  isInCart
  site
  rocket {
    type
  }
}
```

In this case a result can't be extracted from the cache (since our cache is empty), so behind the scenes Apollo Client moves further down the query execution path. At its next step, it essentially splits the original query into two parts - the part that has `@client` fields and the part that will be fired over the network. Both parts are then executed - results are fetched from the network, and results are calculated by running local resolvers. The results from the local resolvers and from the network are then merged together, and the final result is written to the cache and returned. So after our first run, we now have a result in the cache for the original query, that includes data for both the `@client` parts and network parts of the query.

When the `GET_LAUNCH_DETAILS` query is run a second time, again since we're using Apollo Client's default `fetchPolicy` of `cache-and-network`, the cache is checked first for a result. This time a full result can be found for the query, so that result is returned to our `Query` component. Our `@client` field local resolvers aren't fired since the result we're looking for can already be extracted from the cache.

In a lot of situations treating local resolvers just like remote resolvers, by having them adhere to the same `fetchPolicy`, makes a lot of sense. Once you have the data you're looking for, which might have been fetched remotely or calculated using a local resolver, you can cache it and avoid recalculating/re-fetching it again on a subsequent request. But what if you're using local resolvers to run calculations that you need fired on every request? There are a few different ways this can be handled. You can switch your query to use a `fetchPolicy` that forces your entire query to run on each request, like `no-cache` or `network-only`. This will make sure your local resolvers fire on every request, but it will also make sure your network based query components fire on every request. Depending on your use case this might be okay, but what if you want the network parts of your query to leverage the cache, and just want your `@client` parts to run on every request? We'll cover a more flexible option for this in the [Forcing resolvers with `@client(always: true)`](#forcing-resolvers) section.

<h3 id="forcing-resolvers">Forcing resolvers with `@client(always: true)`</h3>

Apollo Client leverages its cache to help reduce the network overhead required when constantly making requests for the same data. By default, `@client` based fields leverage the cache in the exact same manner as remote fields. After a local resolver is run, its result is cached alongside any remote results. This way the next time a query is fired that can find its results in the cache, those results are used, and any associated local resolvers are not fired again (until the data is either removed from the cache or the query is updated to use a `no-cache` or `network-only` `fetchPolicy`).

While leveraging the cache for both local and remote results can be super helpful in a lot of cases, it's not always the best fit. We might want to use a local resolver to calculate a dynamic value that needs to be refreshed on every request, while at the same time continue to use the cache for the network based parts of our query. To support this use case, Apollo Client's `@client` directive accepts an `always` argument, that when set to `true` will ensure that the associated local resolver is run on every request. Looking at an example:

```jsx
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import gql from "graphql-tag";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  resolvers: {
    Query: {
      isLoggedIn() {
        return !!localStorage.getItem("token");
      }
    }
  }
});

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client(always: true)
  }
`;

// ... run the query using client.query, a <Query /> component, etc.
```

The `isLoggedIn` resolver above is checking to see if an authentication token exists in `localStorage`. In this example, we want to make sure that every time the `IS_LOGGED_IN` query is executed, the `isLoggedIn` local resolver is also fired, so that we have the most up to date login information. To do this, we're using a `@client(always: true)` directive in the query, for the `isLoggedIn` field. If we didn't include `always: true`, then the local resolver would fire based on the queries `fetchPolicy`, which means we could be getting back a cached value for `isLoggedIn`. Using `@client(always: true)` ensures that we're always getting the direct result of running the associated local resolver.

> ⚠️ Please consider the impact of using `@client(always: true)` carefully. While forcing a local resolver to run on every request can be useful, if that resolver is computationally expensive or has side effects, you could be negatively impacting your application. We recommend leveraging the cache as much as possible when using local resolvers, to help with application performance. `@client(always: true)` is helpful to have in your tool-belt, but letting local resolvers adhere to a query `fetchPolicy` should be the preferred choice.

While `@client(always: true)` ensures that a local resolver is always fired, it's important to note that if a query is using a `fetchPolicy` that leverages the cache first (`cache-first`, `cache-and-network`, `cache-only`), the query is still attempted to be resolved from the cache first, before the local resolver is fired. This happens because `@client(always: true)` use could be mixed with normal `@client` use in the same query, which means we want part of the query to adhere to the defined `fetchPolicy`. The benefit of this is that anything that can be loaded from the cache first is made available to your `@client(always: true)` resolver function, as its [first parameter](#local-resolvers). So even though you've used `@client(always: true)` to identify that you want to always run a specific resolver, within that resolver you can look at the loaded cache values for the query, and decide if you want to proceed with running the resolver.

<h3 id="client-variables">Using `@client` fields as variables</h3>

Apollo Client provides a way to use an `@client` field result as a variable for a selection set or field, in the same operation. So instead of running an `@client` based query first, getting the local result, then running a second query using the loaded local result as a variable, everything can be handled in one request. This is achieved by combining the `@client` directive with the `@export(as: "variableName")` directive:

```js
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";

const query = gql`
  query currentAuthorPostCount($authorId: Int!) {
    currentAuthorId @client @export(as: "authorId")
    postCount(authorId: $authorId)
  }
`;

const cache = new InMemoryCache();
const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:4000/graphql" }),
  cache,
  resolvers: {}
});

cache.writeData({
  data: {
    currentAuthorId: 12345
  }
});

// ... run the query using client.query, the <Query /> component, etc.
```

In the example above, `currentAuthorId` is first loaded from the cache, then passed into the subsequent `postCount` field as the `authorId` variable (specified by the `@export(as: "authorId")` directive). The `@export` directive can also be used on specific fields within a selection set, like:

```js
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";

const query = gql`
  query currentAuthorPostCount($authorId: Int!) {
    currentAuthor @client {
      name
      authorId @export(as: "authorId")
    }
    postCount(authorId: $authorId)
  }
`;

const cache = new InMemoryCache();
const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:4000/graphql" }),
  cache,
  resolvers: {}
});

cache.writeData({
  data: {
    currentAuthor: {
      __typename: "Author",
      name: "John Smith",
      authorId: 12345
    }
  }
});

// ... run the query using client.query, the <Query /> component, etc.
```

Here the `authorId` variable is set from the `authorId` field loaded from the cache stored `currentAuthor`. `@export` variable use isn't limited to remote queries; it can also be used to define variables for other `@client` fields or selection sets:

```js
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";

const query = gql`
  query currentAuthorPostCount($authorId: Int!) {
    currentAuthorId @client @export(as: "authorId")
    postCount(authorId: $authorId) @client
  }
`;

const cache = new InMemoryCache();
const client = new ApolloClient({
  cache,
  resolvers: {
    Query: {
      postCount(_, { authorId }) {
        return authorId === 12345 ? 100 : 0;
      }
    }
  }
});

cache.writeData({
  data: {
    currentAuthorId: 12345
  }
});

// ... run the query using client.query, the <Query /> component, etc.
```

So here the `currentAuthorId` is loaded from the cache, then passed into the `postCount` local resolver as `authorId`.

**A few important notes about `@export` use:**

1. Apollo Client currently only supports using the `@export` directive to store variables for local data. `@export` must be used with `@client`.

2. `@client @export` use might appear to go against the GraphQL specification, given that the execution order of an operation looks like it could affect the result. From the [Normal and Serial Execution](https://facebook.github.io/graphql/draft/#sec-Normal-and-Serial-Execution) section of the GraphQL spec:

> ... the resolution of fields other than top‐level mutation fields must always be side effect‐free and idempotent, the execution order must not affect the result, and hence the server has the freedom to execute the field entries in whatever order it deems optimal.

Apollo Client currently only supports the use of the `@export` directive when mixed with the `@client` directive. It prepares `@export` variables by first running through an operation that has `@client @export` directives, extracting the specified `@export` variables, then attempting to resolve the value of those variables from the local cache or local resolvers. Once a map of variable names to local values is built up, that map is then used to populate the variables passed in when running the server based GraphQL query. The execution order of the server based GraphQL query is not impacted by `@export` use; the variables are prepped and organized before the server query runs, so the specification is being followed.

3. If you define multiple `@export` variables that use the same name, in a single operation, the value of the last `@export` variable will be used as the variable value moving forward. When this happens Apollo Client will log a warning message (dev only).

<h2 id="managing-the-cache">Managing the cache</h2>

When you're using Apollo Client to work with local state, your Apollo cache becomes the single source of truth for all of your local and remote data. The [Apollo cache API](/docs/react/features/caching.html) has several methods that can assist you with updating and retrieving data. Let's walk through the most relevant methods, and explore some common use cases for each one.

<h3 id="write-data">writeData</h3>

The easiest way to update the cache is with `cache.writeData`, which allows you to write data directly to the cache without passing in a query. Here's how you use it in your resolver map for a simple update:

```js
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  resolvers: {
    Mutation: {
      updateVisibilityFilter: (_, { visibilityFilter }, { cache }) => {
        const data = { visibilityFilter, __typename: 'Filter' };
        cache.writeData({ data });
      },
    },
  },
};
```

`cache.writeData` also allows you to pass in an optional `id` property to write a fragment to an existing object in the cache. This is useful if you want to add some client-side fields to an existing object in the cache.

The `id` should correspond to the object's cache key. If you're using the `InMemoryCache` and not overriding the `dataObjectFromId` config property, your cache key should be `__typename:id`.

```js
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  resolvers: {
    Mutation: {
      updateUserEmail: (_, { id, email }, { cache }) => {
        const data = { email };
        cache.writeData({ id: `User:${id}`, data });
      },
    },
  },
};
```

`cache.writeData` should cover most of your needs; however, there are some cases where the data you're writing to the cache depends on the data that's already there. In that scenario, you should use `readQuery` or `readFragment`, which allows you to pass in a query or a fragment to read data from the cache. If you'd like to validate the shape of your data that you're writing to the cache, use `writeQuery` or `writeFragment`. We'll explain some of those use cases below.

<h3 id="write-read-query">writeQuery and readQuery</h3>

Sometimes, the data you're writing to the cache depends on data that's already in the cache; for example, you're adding an item to a list or setting a property based on an existing property value. In that case, you should use `cache.readQuery` to pass in a query and read a value from the cache before you write any data. Let's look at an example where we add a todo to a list:

```js
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import gql from "graphql-tag";

let nextTodoId = 0;

const cache = new InMemoryCache();
cache.writeData({
  data: {
    todos: []
  }
});

const client = new ApolloClient({
  resolvers: {
    Mutation: {
      addTodo: (_, { text }, { cache }) => {
        const query = gql`
          query GetTodos {
            todos @client {
              id
              text
              completed
            }
          }
        `;

        const previous = cache.readQuery({ query });
        const newTodo = {
          id: nextTodoId++,
          text,
          completed: false,
          __typename: "TodoItem"
        };
        const data = {
          todos: [...previous.todos, newTodo]
        };

        // you can also do cache.writeData({ data }) here if you prefer
        cache.writeQuery({ query, data });
        return newTodo;
      }
    }
  }
});
```

In order to add our todo to the list, we need the todos that are currently in the cache, which is why we call `cache.readQuery` to retrieve them. `cache.readQuery` will throw an error if the data isn't in the cache, so we need to provide an initial state. This is why we're returning an empty array in our `Query.todos` resolver.

To write the data to the cache, you can use either `cache.writeQuery` or `cache.writeData`. The only difference between the two is that `cache.writeQuery` requires that you pass in a query to validate that the shape of the data you're writing to the cache is the same as the shape of the data required by the query. Under the hood, `cache.writeData` automatically constructs a query from the `data` object you pass in and calls `cache.writeQuery`.

<h3 id="write-read-fragment">writeFragment and readFragment</h3>

`cache.readFragment` is similar to `cache.readQuery` except you pass in a fragment. This allows for greater flexibility because you can read from any entry in the cache as long as you have its cache key. In contrast, `cache.readQuery` only lets you read from the root of your cache.

Let's go back to our previous todo list example and see how `cache.readFragment` can help us toggle one of our todos as completed.

```js
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";

const client = new ApolloClient({
  resolvers: {
    Mutation: {
      toggleTodo: (_, variables, { cache }) => {
        const id = `TodoItem:${variables.id}`;
        const fragment = gql`
          fragment completeTodo on TodoItem {
            completed
          }
        `;
        const todo = cache.readFragment({ fragment, id });
        const data = { ...todo, completed: !todo.completed };

        // you can also do cache.writeData({ data, id }) here if you prefer
        cache.writeFragment({ fragment, id, data });
        return null;
      }
    }
  }
});
```

In order to toggle our todo, we need the todo and its status from the cache, which is why we call `cache.readFragment` and pass in a fragment to retrieve it. The `id` we're passing into `cache.readFragment` refers to its cache key. If you're using the `InMemoryCache` and not overriding the `dataObjectFromId` config property, your cache key should be `__typename:id`.

To write the data to the cache, you can use either `cache.writeFragment` or `cache.writeData`. The only difference between the two is that `cache.writeFragment` requires that you pass in a fragment to validate that the shape of the data you're writing to the cache node is the same as the shape of the data required by the fragment. Under the hood, `cache.writeData` automatically constructs a fragment from the `data` object and `id` you pass in and calls `cache.writeFragment`.

<h2 id="client-schema">Client-side schema</h2>

You can optionally set a client-side schema to be used with Apollo Client, through either the `ApolloClient` constructor `typeDefs` parameter, or the local state API `setTypeDefs` method. Your schema should be written in [Schema Definition Language](/docs/graphql-tools/generate-schema.html#schema-language). This schema is not used for validation like it is on the server because the `graphql-js` modules for schema validation would dramatically increase your bundle size. Instead, your client-side schema is used for introspection in [Apollo Client Devtools](https://github.com/apollographql/apollo-client-devtools), where you can explore your schema in GraphiQL.

The following demonstrates how to configure a client-side schema through the `ApolloClient` constructor:

```js
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";

const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [Launch]!
  }

  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [Launch]
  }
`;

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: "http://localhost:4000/graphql" }),
  typeDefs
});
```

If you open up Apollo Client Devtools and click on the `GraphiQL` tab, you'll be able to explore your client schema in the "Docs" section. This example doesn't include a remote schema, but if it did, you would be able to see your local queries and mutations alongside your remote ones.

![GraphiQL Console](../assets/client-schema.png)

<h2 id="advanced">Advanced</h2>

<h3 id="code-splitting">Code splitting</h3>

Depending on the complexity and size of your local resolvers, you might not always want to define them up front, when you create your initial `ApolloClient` instance. If you have local resolvers that are only needed in a specific part of your application, you can leverage Apollo Client's [`addResolvers`](#apollo-client) and [`setResolvers`](#apollo-client) functions to adjust your resolver map at any point. This can be really useful when leveraging techniques like route based code-splitting, using something like [`react-loadable`](https://github.com/jamiebuilds/react-loadable).

Let's say we're building a messaging app and have a `/stats` route that is used return the total number of messages stored locally. If we use `react-loadable` to load our `Stats` component like:

```js
import Loadable from "react-loadable";

import Loading from "./components/Loading";

export const Stats = Loadable({
  loader: () => import("./components/stats/Stats"),
  loading: Loading
});
```

and wait until our `Stats` component is called to define our local resolvers (using `addResolvers`):

```js
import React from "react";
import { ApolloConsumer, Query } from "react-apollo";
import gql from "graphql-tag";

const GET_MESSAGE_COUNT = gql`
  {
    messageCount @client {
      total
    }
  }
`;

const resolvers = {
  Query: {
    messageCount: (_, args, { cache }) => {
      // ... calculate and return the number of messages in
      // the cache ...
      return {
        total: 123,
        __typename: "MessageCount"
      };
    }
  }
};

const MessageCount = () => {
  return (
    <ApolloConsumer>
      {client => {
        client.addResolvers(resolvers);
        return (
          <Query query={GET_MESSAGE_COUNT}>
            {({ loading, data: { messageCount } }) => {
              if (loading) return "Loading ...";
              return <p>Total number of messages: {messageCount.total}</p>;
            }}
          </Query>
        );
      }}
    </ApolloConsumer>
  );
};

export default MessageCount;
```

our local resolver code will only be included in the bundle a user downloads when (if) they access `/stats`. It won't be included in the initial application bundle, which helps keep the size of our initial bundle down, and ultimately helps with download and application startup times.

<h2 id="migrating">Migrating from `apollo-link-state`</h2>

The [`apollo-link-state`](https://github.com/apollographql/apollo-link-state) project was the first to bring local state handling into the Apollo ecosystem. Handling local resolvers through the addition of an `ApolloLink` was a great starting point, and proved that `@client` based queries make sense, and work really well for local state management.

While `apollo-link-state` achieved some of the goals of local state handling, the information available when using any `ApolloLink` is limited by the modularity of the link system. We consider local state management a core part of the Apollo ecosystem, and as Apollo Client progresses, we want to make sure local resolvers are integrated as tightly as possible into core. This integration opens up new possibilities (like `@export` handling) and ties nicely into the future planned adjustments to cache data retention, invalidation, garbage collection, and other planned features that impact both local and remote data.

Updating your application to use Apollo Client's local state management features, instead of `apollo-link-state`, is fairly straightforward. The necessary steps are outlined below.

1. Including `apollo-link-state` as a dependency, and importing it to use `withClientState`, is no longer necessary. You can remove the `apollo-link-state` dependency since local state management is included with `apollo-client` >= 2.5.0.

2. Using `withClientState` is no longer supported. The following

```js
const cache = new InMemoryCache();
const stateLink = withClientState({ cache, resolvers: { ... } });
const link = ApolloLink.from([stateLink, new HttpLink({ uri: '...' })]);
const client = new ApolloClient({
  cache,
  link,
});
```

becomes

```js
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: '...' }),
  resolvers: { ... },
});
```

3. `defaults` are no longer supported. To prep the cache, use [`cache.writeData`](#write-data) directly instead. So

```js
const cache = new InMemoryCache();
const stateLink = withClientState({
  cache,
  resolvers: { ... },
  defaults: {
    someField: 'some value',
  },
});
const link = ApolloLink.from([stateLink, new HttpLink({ uri: '...' })]);
const client = new ApolloClient({
  cache,
  link,
});
```

becomes:

```js
const cache = new InMemoryCache();
const client = new ApolloClient({
  cache,
  link: new HttpLink({ uri: '...' }),
  resolvers: { ... },
});
cache.writeData({
  data: {
    someField: 'some value',
  },
});
```

4. If you're using Apollo Boost, you shouldn't have to change anything. Apollo Boost has been updated to use Apollo Client's integrated local state handling, which means it is no longer using `apollo-link-state`. Behind the scenes, the Apollo Boost `clientState` constructor parameter now feeds the necessary local state initialization directly into Apollo Client.

5. Test thoroughly! 🙂

<h2 id="next-steps">Next steps</h2>

Managing your local data with Apollo Client can help simplify your state management code, since the Apollo cache becomes your single source of truth for all of the data in your application. If you'd like to learn more about Apollo Client's local state features, check out:

- The [Apollo tutorial](https://www.apollographql.com/docs/tutorial/introduction.html) which will not only show you how to use Apollo Client's local state features in a step by step manner, but will also guide you through using other Apollo components to build a fullstack application.
- The [Apollo community slack group](https://www.apollographql.com/slack), in particular the `#local-state` channel, is a great place to ask Apollo Client local state questions.
- Interested in suggesting or working on future changes to help make Apollo Client's local state management even better? We'd love the help! [Open a new feature request](https://github.com/apollographql/apollo-feature-requests) to kick start your feature discussion.
- Found a bug? Impossible! 🙈 Open a new issue in the [Apollo Client repo](https://github.com/apollographql/apollo-client), ideally with a small runnable reproduction, and someone from the community or Apollo team will help get it fixed.

<h2 id="api">API</h2>

Apollo Client local state handling is baked in, so you don't have to install anything extra. Local state management can be configured during `ApolloClient` instantiation (via the `ApolloClient` constructor) or by using the `ApolloClient` local state API. Data in the cache can be managed through the `ApolloCache` API.

<h3 id="apollo-client">ApolloClient</h3>

<h4 id="apollo-client-constructor">Constructor</h4>

```js
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  resolvers: { ... },
  typeDefs: { ... },
});
```

<dl>
  <dt>`resolvers?`: Resolvers | Resolvers[]</dt>
  <dd>A map of resolver functions that your GraphQL queries and mutations call in order to read and write to the cache.</dd>
  <dt>`typeDefs?`: string | string[] | DocumentNode | DocumentNode[];<string></dt>
  <dd>A string representing your client-side schema written in the [Schema Definition Language](/docs/graphql-tools/generate-schema.html#schema-language). This schema is not used for validation, but is used for introspection by the [Apollo Client Devtools](https://github.com/apollographql/apollo-client-devtools).</dd>
</dl>

None of these options are required. If you don't specify anything, you will still be able to use the `@client` directive to query the Apollo Client cache.

<h4 id="apollo-client-methods">Methods</h4>

```js
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: 'http://localhost:4000/graphql' }),
});

client.setResolvers({ ... });
```

<dl>
  <dt>`addResolvers(resolvers: Resolvers | Resolvers[])`</dt>
  <dd>A map of resolver functions that your GraphQL queries and mutations call in order to read and write to the cache. Resolver functions added through `addResolvers` are added to the internal resolver function map, meaning any existing resolvers (that aren't overwritten) are preserved.</dd>
  <dt>`setResolvers(resolvers: Resolvers | Resolvers[])`: </dt>
  <dd>A map of resolver functions that your GraphQL queries and mutations call in order to read and write to the cache. Resolver functions added through `setResolvers` overwrite all existing resolvers (a pre-existing resolver map is wiped out, before the new resolvers are added).</dd>
  <dt>`getResolvers`</dt>
  <dd>Get the currently defined resolver map.</dd>
  <dt>`setLocalStateFragmentMatcher(fragmentMatcher: FragmentMatcher)`</dt>
  <dd>Set a custom `FragmentMatcher` to be used when resolving local state queries involving [fragments on unions or interfaces](/docs/react/advanced/fragments.html#fragment-matcher).</dd>
</dl>

**Typescript interfaces/types:**

```ts
interface Resolvers {
  [key: string]: {
    [field: string]: (
      rootValue?: any,
      args?: any,
      context?: any,
      info?: any
    ) => any;
  };
}

type FragmentMatcher = (
  rootValue: any,
  typeCondition: string,
  context: any
) => boolean;
```

<h3 id="apollo-cache">ApolloCache</h3>

<h4 id="apollo-cache-methods">Methods</h4>

```js
import { InMemoryCache } from "apollo-cache-inmemory";

const cache = new InMemoryCache();
cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem("token"),
    cartItems: []
  }
});
```

<dl>
  <dt>`writeData({ id, data })`</dt>
  <dd>Write data directly to the root of the cache without having to pass in a query. Great for prepping the cache with initial data. If you would like to write data to an existing entry in the cache, pass in the entry's cache key to `id`.</dd>
  <dt>`writeQuery({ query, variables, data })`</dt>
  <dd>Similar to `writeData` (writes data to the root of the cache) but uses the specified query to validate that the shape of the data you’re writing to the cache is the same as the shape of the data required by the query.</dd>
  <dt>`readQuery({ query, variables })`</dt>
  <dd>Read data from the cache for the specified query.</dd>
  <dt>`writeFragment({ id, fragment, fragmentName, variables, data })`</dt>
  <dd>Similar to `writeData` (writes data to an existing entry in the cache) but uses the specified fragment to validate that the shape of the data you’re writing to the cache is the same as the shape of the data required by the fragment.</dd>
  <dt>`readFragment({ id, fragment, fragmentName, variables })`</dt>
  <dd>Read data from the cache for the specified fragment.</dd>
</dl>
---
title: Error handling
description: Handling errors with Apollo
---

Any application, from simple to complex, can have its fair share of errors. It is important to handle these errors and when possible, report these errors back to your users for information. Using GraphQL brings a new set of possible errors from the actual GraphQL response itself. With that in mind, here are a few different types of errors:

- GraphQL Errors: errors in the GraphQL results that can appear alongside successful data
- Server Errors: server internal errors that prevent a successful response from being formed
- Transaction Errors: errors inside transaction actions like `update` on mutations
- UI Errors: errors that occur in your component code
- Apollo Client Errors: internal errors within the core or corresponding libraries

<h2 id="policies" title="Error policies">Error policies</h2>

Much like `fetchPolicy`, `errorPolicy` allows you to control how GraphQL Errors from the server are sent to your UI code. By default, the error policy treats any GraphQL Errors as network errors and ends the request chain. It doesn't save any data in the cache, and renders your UI with the `error` prop to be an ApolloError. By changing this policy per request, you can adjust how GraphQL Errors are managed in the cache and your UI. The possible options for `errorPolicy` are:

- `none`: This is the default policy to match how Apollo Client 1.0 worked. Any GraphQL Errors are treated the same as network errors and any data is ignored from the response.
- `ignore`: Ignore allows you to read any data that is returned alongside GraphQL Errors, but doesn't save the errors or report them to your UI.
- `all`: Using the `all` policy is the best way to notify your users of potential issues while still showing as much data as possible from your server. It saves both data and errors into the Apollo Cache so your UI can use them.

You can set `errorPolicy` on each request like so:

```js
const MY_QUERY = gql`
  query WillFail {
    badField
    goodField
  }
`;
const ShowingSomeErrors = () => (
  <Query query={MY_QUERY} errorPolicy="all">
    {({ error, data, loading }) => {
      if (loading) return <span>loading...</span>;
      return (
        <div>
          <h2>Good: {data.goodField}</h2>
          <pre>
            Bad:{" "}
            {error.graphQLErrors.map(({ message }, i) => (
              <span key={i}>{message}</span>
            ))}
          </pre>
        </div>
      );
    }}
  </Query>
);
```

Any errors reported will come under an `error` prop along side the data returned from the cache or server.

<h2 id="network" title="Network errors">Network Errors</h2>

When using Apollo Link, the ability to handle network errors is way more powerful. The best way to do this is to use the `apollo-link-error` to catch and handle server errors, network errors, and GraphQL errors. If you would like to combine with other links, see [composing links](https://www.apollographql.com/docs/link/composition.html).

#### Usage

```js
import { onError } from "apollo-link-error";

const link = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});
```

#### Options

Error Link takes a function that is called in the event of an error. This function is called with an object containing the following keys:

- `operation`: The Operation that errored
- `response`: The response from the server
- `graphQLErrors`: An array of errors from the GraphQL endpoint
- `networkError`: any error during the link execution or server response

#### Ignoring errors

If you want to conditionally ignore errors, you can set `response.errors = null;` within the error handler:

```js
onError(({ response, operation }) => {
  if (operation.operationName === "IgnoreErrorsQuery") {
    response.errors = null;
  }
});
```

---

## title: Pagination

Often, you will have some views in your application where you need to display a list that contains too much data to be either fetched or displayed at once. Pagination is the most common solution to this problem, and Apollo Client has built-in functionality that makes it quite easy to do.

There are basically two ways of fetching paginated data: numbered pages, and cursors. There are also two ways for displaying paginated data: discrete pages, and infinite scrolling. For a more in-depth explanation of the difference and when you might want to use one vs. the other, we recommend that you read our blog post on the subject: [Understanding Pagination](https://medium.com/apollo-stack/understanding-pagination-rest-graphql-and-relay-b10f835549e7).

In this article, we'll cover the technical details of using Apollo to implement both approaches.

<h2 id="fetch-more">Using `fetchMore`</h2>

In Apollo, the easiest way to do pagination is with a function called [`fetchMore`](../advanced/caching.html#fetchMore), which is provided on the `data` prop by the `graphql` higher order component. This basically allows you to do a new GraphQL query and merge the result into the original result.

You can specify what query and variables to use for the new query, and how to merge the new query result with the existing data on the client. How exactly you do that will determine what kind of pagination you are implementing.

<h2 id="numbered-pages">Offset-based</h2>

Offset-based pagination — also called numbered pages — is a very common pattern, found on many websites, because it is usually the easiest to implement on the backend. In SQL for example, numbered pages can easily be generated by using [OFFSET and LIMIT](https://www.postgresql.org/docs/8.2/static/queries-limit.html).

Here is an example with numbered pages taken from [GitHunt](https://github.com/apollographql/GitHunt-React):

```js
const FEED_QUERY = gql`
  query Feed($type: FeedType!, $offset: Int, $limit: Int) {
    currentUser {
      login
    }
    feed(type: $type, offset: $offset, limit: $limit) {
      id
      # ...
    }
  }
`;

const FeedData = ({ match }) => (
  <Query
    query={FEED_QUERY}
    variables={{
      type: match.params.type.toUpperCase() || "TOP",
      offset: 0,
      limit: 10
    }}
    fetchPolicy="cache-and-network"
  >
    {({ data, fetchMore }) => (
      <Feed
        entries={data.feed || []}
        onLoadMore={() =>
          fetchMore({
            variables: {
              offset: data.feed.length
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              return Object.assign({}, prev, {
                feed: [...prev.feed, ...fetchMoreResult.feed]
              });
            }
          })
        }
      />
    )}
  </Query>
);
```

[See this code in context in GitHunt.](https://github.com/apollographql/GitHunt-React/blob/e5d5dc3abcee7352f5d2e981ee559343e361d2e3/src/routes/FeedPage.js#L26-L68)

As you can see, `fetchMore` is accessible through the render prop function. By default, `fetchMore` will use the original `query`, so we just pass in new variables. Once the new data is returned from the server, the `updateQuery` function is used to merge it with the existing data, which will cause a re-render of your UI component with an expanded list.

The above approach works great for limit/offset pagination. One downside of pagination with numbered pages or offsets is that an item can be skipped or returned twice when items are inserted into or removed from the list at the same time. That can be avoided with cursor-based pagination.

Note that in order for the UI component to receive an updated `loading` prop after `fetchMore` is called, you must set `notifyOnNetworkStatusChange` to `true` in your Query component's props.

<h2 id="cursor-pages">Cursor-based</h2>

In cursor-based pagination, a "cursor" is used to keep track of where in the data set the next items should be fetched from. Sometimes the cursor can be quite simple and just refer to the ID of the last object fetched, but in some cases — for example lists sorted according to some criteria — the cursor needs to encode the sorting criteria in addition to the ID of the last object fetched.

Implementing cursor-based pagination on the client isn't all that different from offset-based pagination, but instead of using an absolute offset, we keep a reference to the last object fetched and information about the sort order used.

In the example below, we use a `fetchMore` query to continuously load new comments, which will be prepended to the list. The cursor to be used in the `fetchMore` query is provided in the initial server response, and is updated whenever more data is fetched.

```js
const MoreCommentsQuery = gql`
  query MoreComments($cursor: String) {
    moreComments(cursor: $cursor) {
      cursor
      comments {
        author
        text
      }
    }
  }
`;

const CommentsWithData = () => (
  <Query query={CommentsQuery}>
    {({ data: { comments, cursor }, loading, fetchMore }) => (
      <Comments
        entries={comments || []}
        onLoadMore={() =>
          fetchMore({
            // note this is a different query than the one used in the
            // Query component
            query: MoreCommentsQuery,
            variables: { cursor: cursor },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const previousEntry = previousResult.entry;
              const newComments = fetchMoreResult.moreComments.comments;
              const newCursor = fetchMoreResult.moreComments.cursor;

              return {
                // By returning `cursor` here, we update the `fetchMore` function
                // to the new cursor.
                cursor: newCursor,
                entry: {
                  // Put the new comments in the front of the list
                  comments: [...newComments, ...previousEntry.comments]
                },
                __typename: previousEntry.__typename
              };
            }
          })
        }
      />
    )}
  </Query>
);
```

<h2 id="relay-cursors">Relay-style cursor pagination</h2>

Relay, another popular GraphQL client, is opinionated about the input and output of paginated queries, so people sometimes build their server's pagination model around Relay's needs. If you have a server that is designed to work with the [Relay Cursor Connections](https://facebook.github.io/relay/graphql/connections.htm) spec, you can also call that server from Apollo Client with no problems.

Using Relay-style cursors is very similar to basic cursor-based pagination. The main difference is in the format of the query response which affects where you get the cursor.

Relay provides a `pageInfo` object on the returned cursor connection which contains the cursor of the first and last items returned as the properties `startCursor` and `endCursor` respectively. This object also contains a boolean property `hasNextPage` which can be used to determine if there are more results available.

The following example specifies a request of 10 items at a time and that results should start after the provided `cursor`. If `null` is passed for the cursor relay will ignore it and provide results starting from the beginning of the data set which allows the use of the same query for both initial and subsequent requests.

```js
const CommentsQuery = gql`
  query Comments($cursor: String) {
    Comments(first: 10, after: $cursor) {
      edges {
        node {
          author
          text
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

const CommentsWithData = () => (
  <Query query={CommentsQuery}>
    {({ data: { Comments: comments }, loading, fetchMore }) => (
      <Comments
        entries={comments || []}
        onLoadMore={() =>
          fetchMore({
            variables: {
              cursor: comments.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.comments.edges;
              const pageInfo = fetchMoreResult.comments.pageInfo;

              return newEdges.length
                ? {
                    // Put the new comments at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
                    comments: {
                      __typename: previousResult.comments.__typename,
                      edges: [...previousResult.comments.edges, ...newEdges],
                      pageInfo
                    }
                  }
                : previousResult;
            }
          })
        }
      />
    )}
  </Query>
);
```

<h2 id="connection-directive">The `@connection` directive</h2>
When using paginated queries, results from accumulated queries can be hard to find in the store, as the parameters passed to the query are used to determine the default store key but are usually not known outside the piece of code that executes the query. This is problematic for imperative store updates, as there is no stable store key for updates to target. To direct Apollo Client to use a stable store key for paginated queries, you can use the optional `@connection` directive to specify a store key for parts of your queries. For example, if we wanted to have a stable store key for the feed query earlier, we could adjust our query to use the `@connection` directive:

```js
const FEED_QUERY = gql`
  query Feed($type: FeedType!, $offset: Int, $limit: Int) {
    currentUser {
      login
    }
    feed(type: $type, offset: $offset, limit: $limit)
      @connection(key: "feed", filter: ["type"]) {
      id
      # ...
    }
  }
`;
```

## This would result in the accumulated feed in every query or `fetchMore` being placed in the store under the `feed` key, which we could later use for imperative store updates. In this example, we also use the `@connection` directive's optional `filter` argument, which allows us to include some arguments of the query in the store key. In this case, we want to include the `type` query argument in the store key, which results in multiple store values that accumulate pages from each type of feed.

## title: Optimistic UI

As explained in the [mutations](/docs/react/basics/mutations.html#optimistic-ui) section, optimistic UI is a pattern that you can use to simulate the results of a mutation and update the UI even before receiving a response from the server. Once the response is received from the server, the optimistic result is thrown away and replaced with the actual result.

Optimistic UI provides an easy way to make your UI respond much faster, while ensuring that the data becomes consistent with the actual response when it arrives.

<h2 id="optimistic-basics">Basic optimistic UI</h2>

Let's say we have an "edit comment" mutation, and we want the UI to update immediately when the user submits the mutation, instead of waiting for the server response. This is what the `optimisticResponse` parameter to the `mutate` function provides.

The main way to get GraphQL data into your UI components with Apollo is to use a query, so if we want our optimistic response to update the UI, we have to make sure to return an optimistic response that will update the correct query result. Learn more about how to do this with the [`dataIdFromObject`](../advanced/caching.html#normalization) option.

Here's what this looks like in the code:

```js
const UPDATE_COMMENT = gql`
  mutation UpdateComment($commentId: ID!, $commentContent: String!) {
    updateComment(commentId: $commentId, commentContent: $commentContent) {
      id
      __typename
      content
    }
  }
`;
const CommentPageWithData = () => (
  <Mutation mutation={UPDATE_COMMENT}>
    {mutate => {
      <Comment
        updateComment={({ commentId, commentContent }) =>
          mutate({
            variables: { commentId, commentContent },
            optimisticResponse: {
              __typename: "Mutation",
              updateComment: {
                id: commentId,
                __typename: "Comment",
                content: commentContent
              }
            }
          })
        }
      />;
    }}
  </Mutation>
);
```

We select `id` and `__typename` because that's what our `dataIdFromObject` uses to determine a globally unique object ID. We need to make sure to provide the right values for those fields, so that Apollo knows what object we are referring to.

<h2 id="optimistic-advanced">Adding to a list</h2>

In the example above, we showed how to seamlessly edit an existing object in the store with an optimistic mutation result. However, many mutations don't just update an existing object in the store, but they insert a new one.

In that case we need to specify how to integrate the new data into existing queries, and thus our UI. You can read in detail about how to do that in the article about [controlling the store](../advanced/caching.html)--in particular, we can use the `update` function to insert a result into an existing query's result set. `update` works exactly the same way for optimistic results and the real results returned from the server.

Here is a concrete example from GitHunt, which inserts a comment into an existing list of comments.

```js
const SUBMIT_COMMENT_MUTATION = gql`
  mutation SubmitComment($repoFullName: String!, $commentContent: String!) {
    submitComment(
      repoFullName: $repoFullName
      commentContent: $commentContent
    ) {
      postedBy {
        login
        html_url
      }
      createdAt
      content
    }
  }
`;

const CommentsPageWithMutations = ({ currentUser }) => (
  <Mutation mutation={SUBMIT_COMMENT_MUTATION}>
    {mutate => (
      <CommentsPage
        submit={(repoFullName, commentContent) =>
          mutate({
            variables: { repoFullName, commentContent },
            optimisticResponse: {
              __typename: "Mutation",
              submitComment: {
                __typename: "Comment",
                postedBy: currentUser,
                createdAt: new Date(),
                content: commentContent
              }
            },
            update: (proxy, { data: { submitComment } }) => {
              // Read the data from our cache for this query.
              const data = proxy.readQuery({ query: CommentAppQuery });
              // Add our comment from the mutation to the end.
              data.comments.push(submitComment);
              // Write our data back to the cache.
              proxy.writeQuery({ query: CommentAppQuery, data });
            }
          })
        }
      />
    )}
  </Mutation>
);
```

---

## title: Server-side rendering

Apollo provides two techniques to allow your applications to load quickly, avoiding unnecessary delays to users:

- Store rehydration, which allows your initial set of queries to return data immediately without a server roundtrip.
- Server side rendering, which renders the initial HTML view on the server before sending it to the client.

You can use one or both of these techniques to provide a better user experience.

<h2 id="store-rehydration">Store rehydration</h2>

For applications that can perform some queries on the server prior to rendering the UI on the client, Apollo allows for setting the initial state of data. This is sometimes called rehydration, since the data is "dehydrated" when it is serialized and included in the initial HTML payload.

For example, a typical approach is to include a script tag that looks something like:

```html
<script>
  window.__APOLLO_STATE__ = JSON.stringify(client.extract());
</script>
```

You can then rehydrate the client using the initial state passed from the server:

```js
const client = new ApolloClient({
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
  link
});
```

We'll see below how you can generate both the HTML and the Apollo store's state using Node and `react-apollo`'s server rendering functions. However if you are rendering HTML via some other means, you will have to generate the state manually.

Then, when the client runs the first set of queries, the data will be returned instantly because it is already in the store!

If you are using `fetchPolicy: network-only` or `fetchPolicy: cache-and-network` on some of the initial queries, you can pass the `ssrForceFetchDelay` option to skip force fetching during initialization, so that even those queries run using the cache:

```js
const client = new ApolloClient({
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
  link,
  ssrForceFetchDelay: 100
});
```

<h2 id="server-rendering">Server-side rendering</h2>

You can render your entire React-based Apollo application on a Node server using rendering functions built into `react-apollo`. These functions take care of the job of fetching all queries that are required to rendering your component tree. Typically you would use these functions from within a HTTP server such as [Express](https://expressjs.com).

No changes are required to client queries to support this, so your Apollo-based React UI should support SSR out of the box.

<h3 id="server-initialization">Server initialization</h3>

In order to render your application on the server, you need to handle a HTTP request (using a server like Express, and a server-capable Router like React-Router), and then render your application to a string to pass back on the response.

We'll see how to take your component tree and turn it into a string in the next section, but you'll need to be a little careful in how you construct your Apollo Client instance on the server to ensure everything works there as well:

1. When [creating an Apollo Client instance](../basics/setup.html) on the server, you'll need to set up your network interface to connect to the API server correctly. This might look different to how you do it on the client, since you'll probably have to use an absolute URL to the server if you were using a relative URL on the client.

2. Since you only want to fetch each query result once, pass the `ssrMode: true` option to the Apollo Client constructor to avoid repeated force-fetching.

3. You need to ensure that you create a new client or store instance for each request, rather than re-using the same client for multiple requests. Otherwise the UI will be getting stale data and you'll have problems with [authentication](../recipes/authentication.html).

Once you put that all together, you'll end up with initialization code that looks like this:

```js
// This example uses React Router v4, although it should work
// equally well with other routers that support SSR

import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import Express from "express";
import { StaticRouter } from "react-router";
import { InMemoryCache } from "apollo-cache-inmemory";

import Layout from "./routes/Layout";

// Note you don't have to use any particular http server, but
// we're using Express in this example
const app = new Express();
app.use((req, res) => {
  const client = new ApolloClient({
    ssrMode: true,
    // Remember that this is the interface the SSR server will use to connect to the
    // API server, so we need to ensure it isn't firewalled, etc
    link: createHttpLink({
      uri: "http://localhost:3010",
      credentials: "same-origin",
      headers: {
        cookie: req.header("Cookie")
      }
    }),
    cache: new InMemoryCache()
  });

  const context = {};

  // The client-side App will instead use <BrowserRouter>
  const App = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.url} context={context}>
        <Layout />
      </StaticRouter>
    </ApolloProvider>
  );

  // rendering code (see below)
});

app.listen(basePort, () =>
  console.log(
    // eslint-disable-line no-console
    `app Server is now running on http://localhost:${basePort}`
  )
);
```

```js
// ./routes/Layout.js

import { Route, Switch } from "react-router";
import { Link } from "react-router-dom";
import React from "react";

// A Routes file is a good shared entry-point between client and server
import routes from "./routes";

const Layout = () => (
  <div>
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/another">Another page</Link>
        </li>
      </ul>
    </nav>

    {/* New <Switch> behavior introduced in React Router v4
       https://reacttraining.com/react-router/web/api/Switch */}
    <Switch>
      {routes.map(route => (
        <Route key={route.name} {...route} />
      ))}
    </Switch>
  </div>
);

export default Layout;
```

```js
// ./routes/index.js

import MainPage from "./MainPage";
import AnotherPage from "./AnotherPage";

const routes = [
  {
    path: "/",
    name: "home",
    exact: true,
    component: MainPage
  },
  {
    path: "/another",
    name: "another",
    component: AnotherPage
  }
];

export default routes;
```

You can check out the [GitHunt app's `src/server.js`](https://github.com/apollographql/GitHunt-React/blob/master/src/server.js) for a complete working example.

Next we'll see what that rendering code actually does.

<h3 id="getDataFromTree">Using `getDataFromTree`</h3>

The `getDataFromTree` function takes your React tree, determines which queries are needed to render them, and then fetches them all. It does this recursively down the whole tree if you have nested queries. It returns a promise which resolves when the data is ready in your Apollo Client store.

At the point that the promise resolves, your Apollo Client store will be completely initialized, which should mean your app will now render instantly (since all queries are prefetched) and you can return the stringified results in the response:

```js
import { getDataFromTree } from "react-apollo"

const client = new ApolloClient(....);

// during request (see above)
getDataFromTree(App).then(() => {
  // We are ready to render for real
  const content = ReactDOM.renderToString(App);
  const initialState = client.extract();

  const html = <Html content={content} state={initialState} />;

  res.status(200);
  res.send(`<!doctype html>\n${ReactDOM.renderToStaticMarkup(html)}`);
  res.end();
});
```

Your markup in this case can look something like:

```js
function Html({ content, state }) {
  return (
    <html>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(
              /</g,
              "\\u003c"
            )};`
          }}
        />
      </body>
    </html>
  );
}
```

<h3 id="local-queries">Avoiding the network for local queries</h3>

If your GraphQL endpoint is on the same server that you're rendering from, you may want to avoid using the network when making your SSR queries. In particular, if localhost is firewalled on your production environment (eg. Heroku), making network requests for these queries will not work.

One solution to this problem is to use an Apollo Link to fetch data using a local graphql schema instead of making a network request. To achieve this, when creating an Apollo Client on the server, you could use [SchemaLink](https://www.apollographql.com/docs/link/links/schema.html) instead of using `createHttpLink` that uses your schema and context to run the query immediately, without any additional network requests.

```js
import { ApolloClient } from "apollo-client";
import { SchemaLink } from "apollo-link-schema";

// ...

const client = new ApolloClient({
  ssrMode: true,
  // Instead of "createHttpLink" use SchemaLink here
  link: new SchemaLink({ schema }),
  cache: new InMemoryCache()
});
```

<h3 id="skip-for-ssr">Skipping queries for SSR</h3>

If you want to intentionally skip a query during SSR, you can pass `ssr: false` in the query options. Typically, this will mean the component will get rendered in its loading state on the server. For example:

```js
const withClientOnlyUser = () => (
  <Query query={GET_USER_WITH_ID} ssr={false}>
    {({ data }) => <span>I won't be run on the server</span>}
  </Query>
);
```

<h3 id="renderToStringWithData">Using `renderToStringWithData`</h3>

The `renderToStringWithData` function simplifies the above and simply returns the content string that you need to render. So it reduces the number of steps slightly:

```js
// server application code (integrated usage)
import { renderToStringWithData } from "react-apollo"

const client = new ApolloClient(....);

// during request
renderToStringWithData(App).then((content) => {
  const initialState = client.extract();
  const html = <Html content={content} state={initialState} />;

  res.status(200);
  res.send(`<!doctype html>\n${ReactDOM.renderToStaticMarkup(html)}`);
  res.end();
});
```

---

title: Developer tools
description: How to use extensions and developer tools to analyze your data

---

<h2 id="engine">Apollo Engine</h2>

[Apollo Engine](/engine) is the best way to run GraphQL in production. It is a GraphQL gateway that helps you implement and run GraphQL over REST or any other backend with confidence. With Engine, you get a number of incredible features to help you understand your GraphQL service, and to make it run faster!

- **Improve response times**: With caching and persisted queries
- **Identify and understand hotspots**: With performance tracing and history
- **Keep an eye on your API**: With alerts and regular reports

Apollo Engine can run anywhere your GraphQL server can. It operates in one of two modes, either as a package you install into your Node server, or as a standalone proxy you can run with Docker, which works with any GraphQL server library. We've architected it to work for the most demanding of environments.

To learn more about Apollo Engine, check out the [guide](/engine)

<h2 id="devtools">Apollo Client Devtools</h2>

The [Apollo Client Devtools](https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm) is a Chrome extension.

<h3 id="features">Features</h3>

The devtools appear as an "Apollo" tab in your Chrome inspector, along side the "Elements" and "Console" tabs. There are currently 3 main features of the devtools:

- GraphiQL: Send queries to your server through the Apollo network interface, or query the Apollo cache to see what data is loaded.
- Normalized store inspector: Visualize your GraphQL store the way Apollo Client sees it, and search by field names or values.
- Watched query inspector: View active queries and variables, and locate the associated UI components.

![GraphiQL Console](../assets/devtools/apollo-client-devtools/apollo-devtools-graphiql.png)

Make requests against either your app’s GraphQL server or the Apollo Client cache through the Chrome developer console. This version of GraphiQL leverages your app’s network interface, so there’s no configuration necessary — it automatically passes along the proper HTTP headers, etc. the same way your Apollo Client app does.

![Store Inspector](../assets/devtools/apollo-client-devtools/apollo-devtools-store.png)

View the state of your client-side cache as a tree and inspect every object inside. Visualize the [mental model](https://blog.apollographql.com/the-concepts-of-graphql-bc68bd819be3) of the Apollo cache. Search for specific keys and values in the store and see the path to those keys highlighted.

![Watched Query Inspector](../assets/devtools/apollo-client-devtools/apollo-devtools-queries.png)

View the queries being actively watched on any given page. See when they're loading, what variables they're using, and, if you’re using React, which React component they’re attached to. Angular support coming soon.

<h3 id="installation">Installation</h3>

You can install the extension via the [Chrome Webstore](https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm).
If you want to install a local version of the extension instead, skip ahead to the **Developing** section.

<h3 id="configuration">Configuration</h3>

While your app is in dev mode, the devtools will appear as an "Apollo" tab in your chrome inspector. To enable the devtools in your app even in production, pass `connectToDevTools: true` to the ApolloClient constructor in your app. Pass `connectToDevTools: false` if want to manually disable this functionality.

The "Apollo" tab will appear in the Chrome console if a global `window.__APOLLO_CLIENT__` object exists in your app. Apollo Client adds this hook to the window automatically unless `process.env.NODE_ENV === 'production'`. If you would like to use the devtools in production, just manually attach your Apollo Client instance to `window.__APOLLO_CLIENT__` or pass `connectToDevTools: true` to the constructor.

Find more information about contributing and debugging on the [Apollo Client DevTools GitHub page](https://github.com/apollographql/apollo-client-devtools).

<h2 id="codegen">Apollo Codegen</h2>

Apollo Codegen is a tool to generate API code or type annotations based on a GraphQL schema and query documents.

It currently generates Swift code, TypeScript annotations, Flow annotations, and Scala code, we hope to add support for other targets in the future.

See [Apollo iOS](https://github.com/apollographql/apollo-ios) for details on the mapping from GraphQL results to Swift types, as well as runtime support for executing queries and mutations. For Scala, see [React Apollo Scala.js](https://github.com/apollographql/react-apollo-scalajs) for details on how to use generated Scala code in a Scala.js app with Apollo Client.

<h3 id="usage">Usage</h3>

If you want to use `apollo-codegen`, you can install it command globally:

```bash
npm install -g apollo-codegen
```

<h3 id="introspect">`introspect-schema`</h3>

The purpose of this command is to create a JSON introspection dump file for a given graphql schema. The input schema can be fetched from a remote graphql server or from a local file. The resulting JSON introspection dump file is needed as input to the [generate](#generate) command.

To download a GraphQL schema by sending an introspection query to a server:

```bash
apollo-codegen introspect-schema http://localhost:8080/graphql --output schema.json
```

You can use the `header` option to add additional HTTP headers to the request. For example, to include an authentication token, use `--header "Authorization: Bearer <token>"`.

You can use the `insecure` option to ignore any SSL errors (for example if the server is running with self-signed certificate).

To generate a GraphQL schema introspection JSON from a local GraphQL schema:

```bash
apollo-codegen introspect-schema schema.graphql --output schema.json
```

<h3 id="generate">`generate`</h3>

The purpose of this command is to generate types for query and mutation operations made against the schema (it will not generate types for the schema itself).

This tool will generate Swift code by default from a set of query definitions in `.graphql` files:

```bash
apollo-codegen generate **/*.graphql --schema schema.json --output API.swift
```

You can also generate type annotations for TypeScript, Flow, or Scala using the `--target` option:

```bash
# TypeScript
apollo-codegen generate **/*.graphql --schema schema.json --target typescript --output operation-result-types.ts
# Flow
apollo-codegen generate **/*.graphql --schema schema.json --target flow --output operation-result-types.flow.js
# Scala
apollo-codegen generate **/*.graphql --schema schema.json --target scala --output operation-result-types.scala
```

<h3 id="template">`gql` template support</h3>

If the source file for generation is a javascript or typescript file, the codegen will try to extrapolate the queries inside the [gql tag](https://github.com/apollographql/graphql-tag) templates.

The tag name is configurable using the CLI `--tag-name` option.

<h3 id="graphqlconfig" title=".graphqlconfig">[.graphqlconfig](https://github.com/graphcool/graphql-config) support</h3>

Instead of using the `--schema` option to point out your GraphQL schema, you can specify it in a `.graphqlconfig` file.

In case you specify multiple schemas in your `.graphqlconfig` file, choose which one to pick by using the `--project-name` option.

<h3 id="typescript-and-flow">Typescript and Flow</h3>

When using `apollo-codegen` with Typescript or Flow, make sure to add the `__typename` introspection field to every selection set within your graphql operations.

If you're using a client like `apollo-client` that does this automatically for your GraphQL operations, pass in the `--addTypename` option to `apollo-codegen` to make sure the generated Typescript and Flow types have the `__typename` field as well. This is required to ensure proper type generation support for `GraphQLUnionType` and `GraphQLInterfaceType` fields.

**Why is the \_\_typename field required?**

Using the type information from the GraphQL schema, we can infer the possible types for fields. However, in the case of a `GraphQLUnionType` or `GraphQLInterfaceType`, there are multiple types that are possible for that field. This is best modeled using a disjoint union with the `__typename`
as the discriminant.

For example, given a schema:

```graphql
interface Character {
  name: String!
}

type Human implements Character {
  homePlanet: String
}

type Droid implements Character {
  primaryFunction: String
}
```

Whenever a field of type `Character` is encountered, it could be either a Human or Droid. Human and Droid objects
will have a different set of fields. Within your application code, when interacting with a `Character` you'll want to make sure to handle both of these cases.

Given this query:

```graphql
query Characters {
  characters(episode: NEW_HOPE) {
    name

    ... on Human {
      homePlanet
    }

    ... on Droid {
      primaryFunction
    }
  }
}
```

Apollo Codegen will generate a union type for Character.

```javascript
export type CharactersQuery = {
  characters: Array<
    | {
        __typename: "Human",
        name: string,
        homePlanet: ?string
      }
    | {
        __typename: "Droid",
        name: string,
        primaryFunction: ?string
      }
  >
};
```

This type can then be used as follows to ensure that all possible types are handled:

```javascript
function CharacterFigures({ characters }: CharactersQuery) {
  return characters.map(character => {
    switch (character.__typename) {
      case "Human":
        return (
          <HumanFigure
            homePlanet={character.homePlanet}
            name={character.name}
          />
        );
      case "Droid":
        return (
          <DroidFigure
            primaryFunction={character.primaryFunction}
            name={character.name}
          />
        );
    }
  });
}
```

---

title: Deferred queries
description: Optimize data loading with the @defer directive

---

<h2 id="defer-setup">Setting up</h2>

Note: `@defer` support is an experimental feature that is only available in the alpha preview of Apollo Server and Apollo Client.

- On the server:

  ```
  npm install apollo-server@alpha
  ```

- On the client, if you are using Apollo Boost:
  ```
  npm install apollo-boost@alpha react-apollo@alpha
  ```
  Or if you are using Apollo Client:
  ```
  npm install apollo-client@alpha apollo-cache-inmemory@alpha apollo-link-http@alpha apollo-link-error apollo-link
  ```

<h2 id="defer">The `@defer` Directive</h2>

Many applications that use Apollo fetch data from a variety of microservices, which may each have varying latencies and cache characteristics. Apollo comes with a built-in directive for deferring parts of your GraphQL query in a declarative way, so that fields that take a long time to resolve do not need to slow down your entire query.

There are 3 main reasons why you may want to defer a field:

1.  **Field is expensive to load.** This includes private data that is not cached (like user progress), or information that requires more computation on the backend (like calculating price quotes on Airbnb).
2.  **Field is not on the critical path for interactivity.** This includes the comments section of a story, or the number of claps received.
3.  **Field is expensive to send.** Even if the field may resolve quickly (ready to send back), users might still choose to defer it if the cost of transport is too expensive.

As an example, take a look at the following query that populates a NewsFeed page:

```graphql
query NewsFeed {
  newsFeed {
    stories {
      text
      comments {
        text
      }
    }
    recommendedForYou {
      story {
        text
        comments {
          text
        }
      }
      matchScore
    }
  }
}
```

It is likely that the time needed for different fields in a query to resolve are significantly different. `stories` is highly public data that we can cache in CDNs (fast), while `recommendedForYou` is personalized and may need to be computed for every user (slooow). Also, we might not need `comments` to be displayed immediately, so slowing down our query to wait for them to be fetched is not the best idea.

<h2 id="defer-how">How to use `@defer`</h2>

We can optimize the above query with `@defer`:

```graphql
query NewsFeed {
  newsFeed {
    stories {
      text
      comments @defer {
        text
      }
    }
    recommendedForYou @defer {
      story {
        text
        comments @defer {
          text
        }
      }
      matchScore
    }
  }
}
```

Once you have added `@defer`, Apollo Server will return an initial response without waiting for deferred fields to resolve, using `null` as placeholders for them. Then, it streams patches for each deferred field asynchronously as they resolve.

```json
// Initial response
{
  "data": {
    "newsFeed": {
      "stories": [{ "text": "...", "comments": null }],
      "recommendedForYou": null
    }
  }
}
```

```json
// Patch for "recommendedForYou"
{
  "path": ["newsFeed", "recommendedForYou"],
  "data": [
    {
      "story": {
        "text": "..."
      },
      "matchScore": 99
    }
  ]
}
```

```json
// Patch for "comments", sent for each story
{
  "path": ["newsFeed", "stories", 1, "comments"],
  "data": [
    {
      "text": "..."
    }
  ]
}
```

If an error is thrown within a resolver, the error gets sent along with its closest deferred parent, and is merged with the `graphQLErrors` array on the client.

```json
// Patch for "comments" if there is an error
{
  "path": ["newsFeed", "stories", 1, "comments"],
  "data": null,
  "errors": [
    {
      "message": "Failed to fetch comments"
    }
  ]
}
```

<h3 id="defer-loadingstate">Distinguishing between "pending" and "null"</h3>

You may have noticed that deferred fields are returned as `null` in the initial response. So how can we know which fields are pending so that we can show some loading indicator? To deal with that, Apollo Client now exposes field-level loading information in a new property called `loadingState` that you can check for in your UI components. The shape of `loadingState` mirrors that of your data. For example, if `data.newsFeed.stories` is ready, `loadingState.newsFeed.stories` will be `true`.

You can use it in a React component like this:

```jsx harmony
<Query query={query}>
  {({ loading, error, data, loadingState }) => {
    if (loading) return "loading...";
    return loadingState.newsFeed.recommendedForYou
      ? data.newsFeed.recommendedForYou
        ? data /* render component here */
        : "No recommended content"
      : "Loading recommended content";
  }}
</Query>
```

<h2 id="defer-usage">Where is `@defer` allowed?</h2>

- `@defer` can be applied on any `FIELD` of a `Query` operation. It also takes an optional argument `if`, that is a `boolean` controlling whether it is active, similar to `@include`.

- `@include` and `@skip` take precedence over `@defer`.

- Mutations: Not supported.

- Non-Nullable Types: Not allowed and will throw a validation error. This is because deferred fields are returned as `null` in the initial response. Deferring non-nullable types may also lead to unexpected behavior when errors occur, since errors will propagate up to the nearest nullable parent as per the GraphQL spec. We want to avoid letting errors on deferred fields clobber the initial data that was loaded already.

- Nesting: `@defer` can be nested arbitrarily. For example, we can defer a list type, and defer a field on an object in the list. During execution, we ensure that the patch for a parent field will be sent before its children, even if the child object resolves first. This will simplify the logic for merging patches.

- GraphQL fragments: Supported. If there are multiple declarations of a field within the query, **all** of them have to contain `@defer` for the field to be deferred. This could happen if we have use a fragment like this:

  ```graphql
  fragment StoryDetail on Story {
    id
    text
  }
  query {
    newsFeed {
      stories {
        text @defer
        ...StoryDetail
      }
    }
  }
  ```

  In this case, `text` will not be deferred since `@defer` was not applied in the fragment definition.

  A common pattern around fragments is to bind it to a component and reuse them across different parts of your UI. This is why it would be ideal to make sure that the `@defer` behavior of fields in a fragment is not overridden.

<h2 id="defer-transport">Transport</h2>

There is no additional setup for the transport required to use `@defer`. By default, deferred responses are transmitted using [Multipart HTTP](https://www.w3.org/Protocols/rfc1341/7_2_Multipart.html). For browsers that do not support the [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) API used to read streaming responses, we will just fallback to normal query execution ignoring `@defer`.

<h2 id="defer-performance">Performance Considerations</h2>

`@defer` is one of those features that work best if used in moderation. If it is used too granularly (on many nested fields), the overhead of performing patching and re-rendering could be worse than just waiting for the full query to resolve. Try to limit `@defer` to fields that take a significantly longer time to load. This is super easy to figure out if you have Apollo Engine set up!

<h2 id="defer-servers">Use with other GraphQL servers</h2>

If you are sending queries to a GraphQL server that does not support `@defer`, it is likely that the `@defer` directive is simply ignored, or a GraphQL validation error is thrown.

If you would want to implement a GraphQL server that is able to interoperate with Apollo Client, please look at the documentation [here](https://github.com/apollographql/apollo-server/blob/defer-support/docs/source/defer-support.md).---
title: Apollo Boost migration
description: Learn how to set up Apollo Client manually without Apollo Boost

---

Apollo Boost is a great way to get started with Apollo Client quickly, but there are some advanced features it doesn't support out of the box. If you'd like to use subscriptions, swap out the Apollo cache, or add an existing Apollo Link to your network stack that isn't already included, you will have to set Apollo Client up manually.

We're working on an eject feature for Apollo Boost that will make migration easier in the future, but for now, let's walk through how to migrate off of Apollo Boost.

<h2 id="basic-migration">Basic migration</h2>

If you're not using any configuration options on Apollo Boost, migration should be relatively simple. All you will have to change is the file where you initialize `ApolloClient`.

<h3 id="before">Before</h3>

Here's what client initialization looks like with Apollo Boost:

```js
import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  uri: "https://w5xlvm3vzz.lp.gql.zone/graphql"
});
```

<h3 id="after">After</h3>

To create a basic client with the same defaults as Apollo Boost, first you need to install some packages:

```bash
npm install apollo-client apollo-cache-inmemory apollo-link-http apollo-link-error apollo-link --save
```

To complete the process, you'll need to manually attach your `cache` and `link` to the client:

```js
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    new HttpLink({
      uri: "https://w5xlvm3vzz.lp.gql.zone/graphql",
      credentials: "same-origin"
    })
  ]),
  cache: new InMemoryCache()
});
```

The `InMemoryCache` is our recommended cache implementation for Apollo Client. The `HttpLink` is an Apollo Link that sends HTTP requests. Your network stack can be made up of one or more links, which you can chain together to create a customizable network stack. Learn more in our [network layer](./network-layer.html) guide or the [Apollo Link](/docs/link.html) docs.

<h2 id="advanced-migration">Advanced migration</h2>

If you are using configuration options on Apollo Boost, your migration path will vary depending on which ones you use. The next example will show an Apollo Boost client configured with every possible option.

<h3 id="before">Before</h3>

Here's what client initialization looks like with Apollo Boost:

```js
import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'https://w5xlvm3vzz.lp.gql.zone/graphql',
  fetchOptions: {
    credentials: 'include'
  },
  request: async (operation) => {
    const token = await AsyncStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: token
      }
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      sendToLoggingService(graphQLErrors);
    }
    if (networkError) {
      logoutUser();
    }
  },
  clientState: {
    defaults: {
      isConnected: true
    },
    resolvers: {
      Mutation: {
        updateNetworkStatus: (_, { isConnected }, { cache }) => {
          cache.writeData({ data: { isConnected }});
          return null;
        }
      }
    }
  },
  cacheRedirects: {
    Query: {
      movie: (_, { id }, { getCacheKey }) =>
        getCacheKey({ __typename: 'Movie', id });
    }
  }
});
```

<h3 id="after">After</h3>

To create a client with the same defaults as Apollo Boost, first you need to install some packages:

```bash
npm install apollo-client apollo-cache-inmemory apollo-link-http apollo-link apollo-link-state apollo-link-error --save
```

Here's how we would create our new client using the configuration options above from Apollo Boost:

```js
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { withClientState } from 'apollo-link-state';
import { ApolloLink, Observable } from 'apollo-link';

const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      movie: (_, { id }, { getCacheKey }) =>
        getCacheKey({ __typename: 'Movie', id });
    }
  }
});

const request = async (operation) => {
  const token = await AsyncStorage.getItem('token');
  operation.setContext({
    headers: {
      authorization: token
    }
  });
};

const requestLink = new ApolloLink((operation, forward) =>
  new Observable(observer => {
    let handle;
    Promise.resolve(operation)
      .then(oper => request(oper))
      .then(() => {
        handle = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });
      })
      .catch(observer.error.bind(observer));

    return () => {
      if (handle) handle.unsubscribe();
    };
  })
);

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        sendToLoggingService(graphQLErrors);
      }
      if (networkError) {
        logoutUser();
      }
    }),
    requestLink,
    withClientState({
      defaults: {
        isConnected: true
      },
      resolvers: {
        Mutation: {
          updateNetworkStatus: (_, { isConnected }, { cache }) => {
            cache.writeData({ data: { isConnected }});
            return null;
          }
        }
      },
      cache
    }),
    new HttpLink({
      uri: 'https://w5xlvm3vzz.lp.gql.zone/graphql',
      credentials: 'include'
    })
  ]),
  cache
});
```

---

title: Subscriptions
description: Learn how to achieve realtime data with GraphQL subscriptions

---

In addition to fetching data using queries and modifying data using mutations, the GraphQL spec supports a third operation type, called `subscription`.

GraphQL subscriptions are a way to push data from the server to the clients that choose to listen to real time messages from the server. Subscriptions are similar to queries in that they specify a set of fields to be delivered to the client, but instead of immediately returning a single answer, a result is sent every time a particular event happens on the server.

A common use case for subscriptions is notifying the client side about particular events, for example the creation of a new object, updated fields and so on.

> This is an advanced feature that Apollo Boost does not support. Learn how to set Apollo Client up manually in our [Apollo Boost migration guide](./boost-migration.html).

<h2 id="overview">Overview</h2>

GraphQL subscriptions have to be defined in the schema, just like queries and mutations:

```js
type Subscription {
  commentAdded(repoFullName: String!): Comment
}
```

On the client, subscription queries look just like any other kind of operation:

```js
subscription onCommentAdded($repoFullName: String!){
  commentAdded(repoFullName: $repoFullName){
    id
    content
  }
}
```

The response sent to the client looks as follows:

```json
{
  "data": {
    "commentAdded": {
      "id": "123",
      "content": "Hello!"
    }
  }
}
```

In the above example, the server is written to send a new result every time a comment is added on GitHunt for a specific repository. Note that the code above only defines the GraphQL subscription in the schema. Read [setting up subscriptions on the client](#subscriptions-client) and [setting up GraphQL subscriptions for the server](https://www.apollographql.com/docs/graphql-subscriptions/index.html) to learn how to add subscriptions to your app.

<h3 id="when-to-use">When to use subscriptions</h3>

In most cases, intermittent polling or manual refetching are actually the best way to keep your client up to date. So when is a subscription the best option? Subscriptions are especially useful if:

1. The initial state is large, but the incremental change sets are small. The starting state can be fetched with a query and subsequently updated through a subscription.
2. You care about low-latency updates in the case of specific events, for example in the case of a chat application where users expect to receive new messages in a matter of seconds.

A future version of Apollo or GraphQL might include support for live queries, which would be a low-latency way to replace polling, but at this point general live queries in GraphQL are not yet possible outside of some relatively experimental setups.

<h2 id="subscriptions-client">Client setup</h2>

The most popular transport for GraphQL subscriptions today is [`subscriptions-transport-ws`](https://github.com/apollographql/subscriptions-transport-ws). This package is maintained by the Apollo community, but can be used with any client or server GraphQL implementation. In this article, we'll explain how to set it up on the client, but you'll also need a server implementation. You can [read about how to use subscriptions with a JavaScript server](/docs/graphql-subscriptions/setup.html), or enjoy subscriptions set up out of the box if you are using a GraphQL backend as a service like [Graphcool](https://www.graph.cool/docs/tutorials/worldchat-subscriptions-example-ui0eizishe/) or [Scaphold](https://scaphold.io/blog/2016/11/09/build-realtime-apps-with-subs.html).

Let's look at how to add support for this transport to Apollo Client.

First, install the WebSocket Apollo Link (`apollo-link-ws`) from npm:

```shell
npm install --save apollo-link-ws subscriptions-transport-ws
```

Then, initialize a GraphQL subscriptions transport link:

```js
import { WebSocketLink } from "apollo-link-ws";

const wsLink = new WebSocketLink({
  uri: `ws://localhost:5000/`,
  options: {
    reconnect: true
  }
});
```

```js
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

// Create an http link:
const httpLink = new HttpLink({
  uri: "http://localhost:3000/graphql"
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://localhost:5000/`,
  options: {
    reconnect: true
  }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);
```

Now, queries and mutations will go over HTTP as normal, but subscriptions will be done over the websocket transport.

<h2 id="subscription-component">Subscription Component</h2>
The easiest way to bring live data to your UI is using the Subscription component from React Apollo. This lets you render the stream of data from your service directly within your render function of your component! One thing to note, subscriptions are just listeners, they don't request any data when first connected, but only open up a connection to get new data. Binding live data to your UI is as easy as this:

```js
const COMMENTS_SUBSCRIPTION = gql`
  subscription onCommentAdded($repoFullName: String!) {
    commentAdded(repoFullName: $repoFullName) {
      id
      content
    }
  }
`;

const DontReadTheComments = ({ repoFullName }) => (
  <Subscription
    subscription={COMMENTS_SUBSCRIPTION}
    variables={{ repoFullName }}
  >
    {({ data: { commentAdded }, loading }) => (
      <h4>New comment: {!loading && commentAdded.content}</h4>
    )}
  </Subscription>
);
```

<h2 id="api">Subscription Component API overview</h2>

If you're looking for an overview of all the props `Subscription` accepts and its render prop function, look no further!

<h3 id="props">Props</h3>

The Subscription component accepts the following props. Only `subscription` and `children` are **required**.

<dl>
  <dt>`subscription`: DocumentNode</dt>
  <dd>A GraphQL subscription document parsed into an AST by `graphql-tag`. **Required**</dd>
  <dt>`children`: (result: SubscriptionResult) => React.ReactNode</dt>
  <dd>A function returning the UI you want to render based on your subscription result.</dd>
  <dt>`variables`: { [key: string]: any }</dt>
  <dd>An object containing all of the variables your subscription needs to execute</dd>
  <dt>`shouldResubscribe`: boolean | (currentProps: Object, nextProps: Object) => boolean</dt>
  <dd>Determines if your subscription should be unsubscribed and subscribed again. By default, the component will only resubscribe if `variables` or `subscription` props change.</dd>
  <dt>`onSubscriptionData`: (options: OnSubscriptionDataOptions<TData>) => any</dt>
  <dd>Allows the registration of a callback function, that will be triggered each time the `Subscription` component receives data. The callback `options` object param consists of the current Apollo Client instance in `client`, and the received subscription data in `subscriptionData`.</dd>
  <dt>`fetchPolicy`: FetchPolicy</dt>
  <dd>How you want your component to interact with the Apollo cache. Defaults to "cache-first".</dd>
</dl>

<h3 id="render-prop">Render prop function</h3>

The render prop function that you pass to the `children` prop of `Subscription` is called with an object that has the following properties

<dl>
  <dt>`data`: TData</dt>
  <dd>An object containing the result of your GraphQL subscription. Defaults to an empty object.</dd>
  <dt>`loading`: boolean</dt>
  <dd>A boolean that indicates whether any initial data has been returned</dd>
  <dt>`error`: ApolloError</dt>
  <dd>A runtime error with `graphQLErrors` and `networkError` properties</dd>
</dl>

<h2 id="subscribe-to-more">subscribeToMore</h2>

With GraphQL subscriptions your client will be alerted on push from the server and you should choose the pattern that fits your application the most:

- Use it as a notification and run any logic you want when it fires, for example alerting the user or refetching data
- Use the data sent along with the notification and merge it directly into the store (existing queries are automatically notified)

With `subscribeToMore`, you can easily do the latter.

`subscribeToMore` is a function available on every query result in `react-apollo`. It works just like [`fetchMore`](./caching.html#fetchMore), except that the update function gets called every time the subscription returns, instead of only once.

Here is a regular query:

```js
const COMMENT_QUERY = gql`
  query Comment($repoName: String!) {
    entry(repoFullName: $repoName) {
      comments {
        id
        content
      }
    }
  }
`;

const CommentsPageWithData = ({ params }) => (
  <Query
    query={COMMENT_QUERY}
    variables={{ repoName: `${params.org}/${params.repoName}` }}
  >
    {result => <CommentsPage {...result} />}
  </Query>
);
```

Now, let's add the subscription.

Add a function called `subscribeToNewComments` that will subscribe using `subscribeToMore` and update the query's store with the new data using `updateQuery`.

Note that the `updateQuery` callback must return an object of the same shape as the initial query data, otherwise the new data won't be merged. Here the new comment is pushed in the `comments` list of the `entry`:

```js
const COMMENT_QUERY = gql`
  query Comment($repoName: String!) {
    entry(repoFullName: $repoName) {
      comments {
        id
        content
      }
    }
  }
`;

const COMMENTS_SUBSCRIPTION = gql`
  subscription onCommentAdded($repoName: String!) {
    commentAdded(repoName: $repoName) {
      id
      content
    }
  }
`;

const CommentsPageWithData = ({ params }) => (
  <Query
    query={COMMENT_QUERY}
    variables={{ repoName: `${params.org}/${params.repoName}` }}
  >
    {({ subscribeToMore, ...result }) => (
      <CommentsPage
        {...result}
        subscribeToNewComments={() =>
          subscribeToMore({
            document: COMMENTS_SUBSCRIPTION,
            variables: { repoName: params.repoName },
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) return prev;
              const newFeedItem = subscriptionData.data.commentAdded;

              return Object.assign({}, prev, {
                entry: {
                  comments: [newFeedItem, ...prev.entry.comments]
                }
              });
            }
          })
        }
      />
    )}
  </Query>
);
```

and start the actual subscription by calling the `subscribeToNewComments` function with the subscription variables:

```js
export class CommentsPage extends Component {
  componentDidMount() {
    this.props.subscribeToNewComments();
  }
}
```

<h2 id="authentication">Authentication over WebSocket</h2>

In many cases it is necessary to authenticate clients before allowing them to receive subscription results. To do this, the `SubscriptionClient` constructor accepts a `connectionParams` field, which passes a custom object that the server can use to validate the connection before setting up any subscriptions.

```js
import { WebSocketLink } from 'apollo-link-ws';

const wsLink = new WebSocketLink({
  uri: `ws://localhost:5000/`,
  options: {
    reconnect: true,
    connectionParams: {
        authToken: user.authToken,
    },
});
```

> You can use `connectionParams` for anything else you might need, not only authentication, and check its payload on the server side with [SubscriptionsServer](/docs/graphql-subscriptions/authentication.html).

---

title: Network layer (Apollo Link)
order: 110
description: How to configure Apollo Client's network layer.

---

Now that you have learned how to read and update your data, its helpful to know how to direct where your data comes from and where it goes! Apollo has a powerful way to manage your network layer using a library called [Apollo Link](/docs/link).

<h2 id="network-interfaces">Apollo Link</h2>

Apollo Client has a pluggable network interface layer, which can let you configure how queries are sent over HTTP, or replace the whole network part with something completely custom, like a websocket transport, mocked server data, or anything else you can imagine.

<h3 title="Using a link">Using a link</h3>

To create a link to use with Apollo Client, you can install and import one from npm or create your own. We recommend using `apollo-link-http` for most setups.

Here's how you would instantiate a new client with a custom endpoint URL using the HttpLink:

```js
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";

const link = new HttpLink({ uri: "https://example.com/graphql" });

const client = new ApolloClient({
  link
  // other options like cache
});
```

And if you needed to pass additional options to [`fetch`](https://github.github.io/fetch/):

```js
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";

const link = new HttpLink({
  uri: "https://example.com/graphql",
  // Additional fetch options like `credentials` or `headers`
  credentials: "same-origin"
});

const client = new ApolloClient({
  link
  // other options like cache
});
```

<h3 id="linkMiddleware" title="Middleware">Middleware</h3>

Apollo Link is designed from day one to be easy to use middleware on your requests. Middlewares are used to inspect and modify every request made over the `link`, for example, adding authentication tokens to every query. In order to add middleware, you simply create a new link and join it with the `HttpLink`.

The following examples shows how you'd create a middleware. In both examples, we'll show how you would add an authentication token to the HTTP header of the requests being sent by the client.

```js
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { ApolloLink, concat } from "apollo-link";

const httpLink = new HttpLink({ uri: "/graphql" });

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: localStorage.getItem("token") || null
    }
  });

  return forward(operation);
});

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink)
});
```

The above example shows the use of a single middleware joined with the HttpLink. It checks to see if we have a token (JWT, for example) and passes that token into the HTTP header of the request, so we can authenticate interactions with GraphQL performed through our network interface.

The following example shows the use of multiple middlewares passed as an array:

```js
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { ApolloLink, from } from "apollo-link";

const httpLink = new HttpLink({ uri: "/graphql" });

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: localStorage.getItem("token") || null
    }
  }));

  return forward(operation);
});

const otherMiddleware = new ApolloLink((operation, forward) => {
  // add the recent-activity custom header to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      "recent-activity": localStorage.getItem("lastOnlineTime") || null
    }
  }));

  return forward(operation);
});

const client = new ApolloClient({
  link: from([authMiddleware, otherMiddleware, httpLink])
});
```

Given the code above, the header's `Authorization` value will be that of `token` from `localStorage` by `authMiddleware` and the `recent-activity` value will be set by `otherMiddleware` to `lastOnlineTime` again from `localStorage`. This example shows how you can use more than one middleware to make multiple/separate modifications to the request being processed in the form of a chain. This example doesn't show the use of `localStorage`, but is instead just meant to demonstrate the use of more than one middleware using Apollo Link.

<h3 id="linkAfterware" title="Afterware">Afterware</h3>

'Afterware' is very similar to a middleware, except that an afterware runs after a request has been made,
that is when a response is going to get processed. It's perfect for responding to the situation where a user becomes logged out during their session.

Much like middlewares, Apollo Link was designed to make afterwares easy and powerful to use with Apollo!

The following example demonstrates how to implement an afterware function.

```js
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";

import { logout } from "./logout";

const httpLink = new HttpLink({ uri: "/graphql" });

const logoutLink = onError(({ networkError }) => {
  if (networkError.statusCode === 401) logout();
});

const client = new ApolloClient({
  link: logoutLink.concat(httpLink)
});
```

The above example shows the use of `apollo-link-error` to handle network errors from a response.
It checks to see if the response status code is equal to 401 and if it is then we will
logout the user from the application.

<h3 id="query-deduplication">Query deduplication</h3>
Query deduplication can help reduce the number of queries that are sent over the wire. It is turned on by default, but can be turned off by passing `queryDeduplication: false` to the context on each requests or using the `defaultOptions` key on Apollo Client setup. If turned on, query deduplication happens before the query hits the network layer.

Query deduplication can be useful if many components display the same data, but you don't want to fetch that data from the server many times. It works by comparing a query to all queries currently in flight. If an identical query is currently in flight, the new query will be mapped to the same promise and resolved when the currently in-flight query returns.

<h2 id="other-links">Other links</h2>
The network stack of Apollo Client is easily customized using Apollo Link! It can log errors, send side effects, send data over WebSockets or HTTP, and so much more. A few examples are below but make sure to check out the [link docs](/docs/link) to learn more!

<h3 id="websocket">GraphQL over WebSocket</h3>

Another alternative for network interface is GraphQL over WebSocket, using [`subscriptions-transport-ws`](https://github.com/apollographql/subscriptions-transport-ws/).

You can then create WebSocket as full-transport, and pass all GraphQL operations over the WebSocket (`Query`, `Mutation` and `Subscription`), or use a hybrid network interface and execute `Query` and `Mutation` over HTTP, and only `Subscription` over the WebSocket.

For more information about using WebSockets with Apollo Link, check out the [in-depth guide](/docs/link/links/ws.html)

<h3 id="query-batching">Query Batching</h3>
Apollo lets you automatically batch multiple queries into one request when they are made within a certain interval. This means that if you render several components, for example a navbar, sidebar, and content, and each of those do their own GraphQL query, they will all be sent in one roundtrip. Batching works only with server that support batched queries (for example graphql-server). Batched requests to servers that don’t support batching will fail. To learn how to use batching with Apollo checkout the [in-depth guide](/docs/link/links/batch-http.html)

<h3 id="MutationBatching">Mutation batching</h3>
 Apollo also lets you automatically run multiple mutations in one request, similar to queries, by batching multiple mutations into one request.
---
title: Caching data
description: A guide to customizing and directly accessing your Apollo cache
---

<h2>InMemoryCache</h2>

`apollo-cache-inmemory` is the default cache implementation for Apollo Client 2.0. `InMemoryCache` is a normalized data store that supports all of Apollo Client 1.0's features without the dependency on Redux.

In some instances, you may need to manipulate the cache directly, such as updating the store after a mutation. We'll cover some common use cases [here](#recipes).

<h3 id="installation">Installation</h3>

```bash
npm install apollo-cache-inmemory --save
```

After installing the package, you'll want to initialize the cache constructor. Then, you can pass in your newly created cache to ApolloClient.

```js
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloClient } from "apollo-client";

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: new HttpLink(),
  cache
});
```

<h3 id="configuration">Configuration</h3>

The `InMemoryCache` constructor takes an optional config object with properties to customize your cache:

- `addTypename`: A boolean to determine whether to add \_\_typename to the document (default: `true`)
- `dataIdFromObject`: A function that takes a data object and returns a unique identifier to be used when normalizing the data in the store. Learn more about how to customize `dataIdFromObject` in the [Normalization](#normalization) section.
- `fragmentMatcher`: By default, the `InMemoryCache` uses a heuristic fragment matcher. If you are using fragments on unions and interfaces, you will need to use an `IntrospectionFragmentMatcher`. For more information, please read [our guide to setting up fragment matching for unions & interfaces](./fragments.html#fragment-matcher).
- `cacheRedirects` (previously known as `cacheResolvers` or `customResolvers`): A map of functions to redirect a query to another entry in the cache before a request takes place. This is useful if you have a list of items and want to use the data from the list query on a detail page where you're querying an individual item. More on that [here](https://www.apollographql.com/docs/react/advanced/caching.html#cacheRedirect).

<h3 id="normalization">Normalization</h3>

The `InMemoryCache` normalizes your data before saving it to the store by splitting the result into individual objects, creating a unique identifier for each object, and storing those objects in a flattened data structure. By default, `InMemoryCache` will attempt to use the commonly found primary keys of `id` and `_id` for the unique identifier if they exist along with `__typename` on an object.

If `id` and `_id` are not specified, or if `__typename` is not specified, `InMemoryCache` will fall back to the path to the object in the query, such as `ROOT_QUERY.allPeople.0` for the first record returned on the `allPeople` root query.
That would make data for given type scoped for `allPeople` query and other queries would have to fetch their own separate objects.

This "getter" behavior for unique identifiers can be configured manually via the `dataIdFromObject` option passed to the `InMemoryCache` constructor, so you can pick which field is used if some of your data follows unorthodox primary key conventions so it could be referenced by any query.

For example, if you wanted to key off of the `key` field for all of your data, you could configure `dataIdFromObject` like so:

```js
const cache = new InMemoryCache({
  dataIdFromObject: object => object.key || null
});
```

Note that Apollo Client doesn't add the type name to the cache key when you specify a custom `dataIdFromObject`, so if your IDs are not unique across all objects, you might want to include the `__typename` in your `dataIdFromObject`.

You can use different unique identifiers for different data types by keying off of the `__typename` property attached to every object typed by GraphQL. For example:

```js
import { InMemoryCache, defaultDataIdFromObject } from "apollo-cache-inmemory";

const cache = new InMemoryCache({
  dataIdFromObject: object => {
    switch (object.__typename) {
      case "foo":
        return object.key; // use `key` as the primary key
      case "bar":
        return `bar:${object.blah}`; // use `bar` prefix and `blah` as the primary key
      default:
        return defaultDataIdFromObject(object); // fall back to default handling
    }
  }
});
```

<h3 id="automatic-updates">Automatic cache updates</h3>

Let's look at a case where just using the cache normalization results in the correct update to our store. Let's say we perform the following query:

```graphql
{
  post(id: '5') {
    id
    score
  }
}
```

Then, we perform the following mutation:

```graphql
mutation {
  upvotePost(id: '5') {
    id
    score
  }
}
```

If the `id` field on both results matches up, then the `score` field everywhere in our UI will be updated automatically! One nice way to take advantage of this property as much as possible is to make your mutation results have all of the data necessary to update the queries previously fetched. A simple trick for this is to use [fragments](./fragments.html) to share fields between the query and the mutation that affects it.

<h2 id="direct">Direct Cache Access</h2>

To interact directly with your cache, you can use the Apollo Client class methods readQuery, readFragment, writeQuery, and writeFragment. These methods are available to us via the `DataProxy` interface. Accessing these methods will vary slightly based on your view layer implementation. If you are using React, you can wrap your component in the `withApollo` higher order component, which will give you access to `this.props.client`. From there, you can use the methods to control your data.

Any code demonstration in the following sections will assume that we have already initialized an instance of `ApolloClient` and that we have imported the `gql` tag from `graphql-tag`.

<h3 id="readquery">readQuery</h3>

The `readQuery` method is very similar to the `query` method on `ApolloClient` except that `readQuery` will _never_ make a request to your GraphQL server. The `query` method, on the other hand, may send a request to your server if the appropriate data is not in your cache whereas `readQuery` will throw an error if the data is not in your cache. `readQuery` will _always_ read from the cache. You can use `readQuery` by giving it a GraphQL query like so:

```js
const { todo } = client.readQuery({
  query: gql`
    query ReadTodo {
      todo(id: 5) {
        id
        text
        completed
      }
    }
  `
});
```

If all of the data needed to fulfill this read is in Apollo Client’s normalized data cache then a data object will be returned in the shape of the query you wanted to read. If not all of the data needed to fulfill this read is in Apollo Client’s cache then an error will be thrown instead, so make sure to only read data that you know you have!

You can also pass variables into `readQuery`.

```js
const { todo } = client.readQuery({
  query: gql`
    query ReadTodo($id: Int!) {
      todo(id: $id) {
        id
        text
        completed
      }
    }
  `,
  variables: {
    id: 5
  }
});
```

<h3 id="readfragment">readFragment</h3>

This method allows you great flexibility around the data in your cache. Whereas `readQuery` only allowed you to read data from your root query type, `readFragment` allows you to read data from _any node you have queried_. This is incredibly powerful. You use this method as follows:

```js
const todo = client.readFragment({
  id: ..., // `id` is any id that could be returned by `dataIdFromObject`.
  fragment: gql`
    fragment myTodo on Todo {
      id
      text
      completed
    }
  `,
});
```

The first argument is the id of the data you want to read from the cache. That id must be a value that was returned by the `dataIdFromObject` function you defined when initializing `ApolloClient`. So for example if you initialized `ApolloClient` like so:

```js
const client = new ApolloClient({
  ...,
  cache: new InMemoryCache({
    ...,
    dataIdFromObject: object => object.id,
  }),
});
```

…and you requested a todo before with an id of `5`, then you can read that todo out of your cache with the following:

```js
const todo = client.readFragment({
  id: "5",
  fragment: gql`
    fragment myTodo on Todo {
      id
      text
      completed
    }
  `
});
```

> **Note:** Most people add a `__typename` to the id in `dataIdFromObject`. If you do this then don’t forget to add the `__typename` when you are reading a fragment as well. So for example your id may be `Todo_5` and not just `5`.

If a todo with that id does not exist in the cache you will get `null` back. If a todo of that id does exist in the cache, but that todo does not have the `text` field then an error will be thrown.

The beauty of `readFragment` is that the todo could have come from anywhere! The todo could have been selected as a singleton (`{ todo(id: 5) { ... } }`), the todo could have come from a list of todos (`{ todos { ... } }`), or the todo could have come from a mutation (`mutation { createTodo { ... } }`). As long as at some point your GraphQL server gave you a todo with the provided id and fields `id`, `text`, and `completed` you can read it from the cache at any part of your code.

<h3 id="writequery-and-writefragment">writeQuery and writeFragment</h3>

Not only can you read arbitrary data from the Apollo Client cache, but you can also write any data that you would like to the cache. The methods you use to do this are `writeQuery` and `writeFragment`. They will allow you to change data in your local cache, but it is important to remember that _they will not change any data on your server_. If you reload your environment then changes made with `writeQuery` and `writeFragment` will disappear.

These methods have the same signature as their `readQuery` and `readFragment` counterparts except they also require an additional `data` variable. So for example, if you wanted to update the `completed` flag locally for your todo with id `'5'` you could execute the following:

```js
client.writeFragment({
  id: "5",
  fragment: gql`
    fragment myTodo on Todo {
      completed
    }
  `,
  data: {
    completed: true
  }
});
```

Any subscriber to the Apollo Client store will instantly see this update and render new UI accordingly.

> **Note:** Again, remember that using `writeQuery` or `writeFragment` only changes data _locally_. If you reload your environment then changes made with these methods will no longer exist.

Or if you wanted to add a new todo to a list fetched from the server, you could use `readQuery` and `writeQuery` together.

```js
const query = gql`
  query MyTodoAppQuery {
    todos {
      id
      text
      completed
    }
  }
`;

const data = client.readQuery({ query });

const myNewTodo = {
  id: "6",
  text: "Start using Apollo Client.",
  completed: false,
  __typename: "Todo"
};

client.writeQuery({
  query,
  data: {
    todos: [...data.todos, myNewTodo]
  }
});
```

<h2 id="recipes">Recipes</h2>

Here are some common situations where you would need to access the cache directly. If you're manipulating the cache in an interesting way and would like your example to be featured, please send in a pull request!

<h3 id="ignore">Bypassing the cache</h3>
Sometimes it makes sense to not use the cache for a specific operation. This can be done using either the `network-only` or `no-cache` fetchPolicy. The key difference between these two policies is that `network-only` still saves the response to the cache for later use, bypassing the reading and forcing a network request. The `no-cache` policy does not read, nor does it write to the cache with the response. This may be useful for sensitive data like passwords that you don't want to keep in the cache.

<h3 id="after-mutations">Updating after a mutation</h3>

In some cases, just using `dataIdFromObject` is not enough for your application UI to update correctly. For example, if you want to add something to a list of objects without refetching the entire list, or if there are some objects that to which you can't assign an object identifier, Apollo Client cannot update existing queries for you. Read on to learn about the other tools at your disposal.

`refetchQueries` is the simplest way of updating the cache. With `refetchQueries` you can specify one or more queries that you want to run after a mutation is completed in order to refetch the parts of the store that may have been affected by the mutation:

```javascript
mutate({
  //... insert comment mutation
  refetchQueries: [
    {
      query: gql`
        query UpdateCache($repoName: String!) {
          entry(repoFullName: $repoName) {
            id
            comments {
              postedBy {
                login
                html_url
              }
              createdAt
              content
            }
          }
        }
      `,
      variables: { repoName: "apollographql/apollo-client" }
    }
  ]
});
```

Please note that if you call `refetchQueries` with an array of strings, then Apollo Client will look for any previously called queries that have the same names as the provided strings. It will then refetch those queries with their current variables.

A very common way of using `refetchQueries` is to import queries defined for other components to make sure that those components will be updated:

```javascript
import RepoCommentsQuery from "../queries/RepoCommentsQuery";

mutate({
  //... insert comment mutation
  refetchQueries: [
    {
      query: RepoCommentsQuery,
      variables: { repoFullName: "apollographql/apollo-client" }
    }
  ]
});
```

Using `update` gives you full control over the cache, allowing you to make changes to your data model in response to a mutation in any way you like. `update` is the recommended way of updating the cache after a query. It is explained in full [here](../api/react-apollo.html#graphql-mutation-options-update).

```javascript
import CommentAppQuery from "../queries/CommentAppQuery";

const SUBMIT_COMMENT_MUTATION = gql`
  mutation SubmitComment($repoFullName: String!, $commentContent: String!) {
    submitComment(
      repoFullName: $repoFullName
      commentContent: $commentContent
    ) {
      postedBy {
        login
        html_url
      }
      createdAt
      content
    }
  }
`;

const CommentsPageWithMutations = () => (
  <Mutation mutation={SUBMIT_COMMENT_MUTATION}>
    {mutate => {
      <AddComment
        submit={({ repoFullName, commentContent }) =>
          mutate({
            variables: { repoFullName, commentContent },
            update: (store, { data: { submitComment } }) => {
              // Read the data from our cache for this query.
              const data = store.readQuery({ query: CommentAppQuery });
              // Add our comment from the mutation to the end.
              data.comments.push(submitComment);
              // Write our data back to the cache.
              store.writeQuery({ query: CommentAppQuery, data });
            }
          })
        }
      />;
    }}
  </Mutation>
);
```

<h3 id="fetchMore">Incremental loading: `fetchMore`</h3>

`fetchMore` can be used to update the result of a query based on the data returned by another query. Most often, it is used to handle infinite-scroll pagination or other situations where you are loading more data when you already have some.

In our GitHunt example, we have a paginated feed that displays a list of GitHub repositories. When we hit the "Load More" button, we don't want Apollo Client to throw away the repository information it has already loaded. Instead, it should just append the newly loaded repositories to the list that Apollo Client already has in the store. With this update, our UI component should re-render and show us all of the available repositories.

Let's see how to do that with the `fetchMore` method on a query:

```javascript
const FEED_QUERY = gql`
  query Feed($type: FeedType!, $offset: Int, $limit: Int) {
    currentUser {
      login
    }
    feed(type: $type, offset: $offset, limit: $limit) {
      id
      # ...
    }
  }
`;

const FeedWithData = ({ match }) => (
  <Query
    query={FEED_QUERY}
    variables={{
      type: match.params.type.toUpperCase() || "TOP",
      offset: 0,
      limit: 10
    }}
    fetchPolicy="cache-and-network"
  >
    {({ data, fetchMore }) => (
      <Feed
        entries={data.feed || []}
        onLoadMore={() =>
          fetchMore({
            variables: {
              offset: data.feed.length
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              return Object.assign({}, prev, {
                feed: [...prev.feed, ...fetchMoreResult.feed]
              });
            }
          })
        }
      />
    )}
  </Query>
);
```

The `fetchMore` method takes a map of `variables` to be sent with the new query. Here, we're setting the offset to `feed.length` so that we fetch items that aren't already displayed on the feed. This variable map is merged with the one that's been specified for the query associated with the component. This means that other variables, e.g. the `limit` variable, will have the same value as they do within the component query.

It can also take a `query` named argument, which can be a GraphQL document containing a query that will be fetched in order to fetch more information; we refer to this as the `fetchMore` query. By default, the `fetchMore` query is the query associated with the container, in this case the `FEED_QUERY`.

When we call `fetchMore`, Apollo Client will fire the `fetchMore` query and use the logic in the `updateQuery` option to incorporate that into the original result. The named argument `updateQuery` should be a function that takes the previous result of the query associated with your component (i.e. `FEED_QUERY` in this case) and the information returned by the `fetchMore` query and return a combination of the two.

Here, the `fetchMore` query is the same as the query associated with the component. Our `updateQuery` takes the new feed items returned and just appends them onto the feed items that we'd asked for previously. With this, the UI will update and the feed will contain the next page of items!

Although `fetchMore` is often used for pagination, there are many other cases in which it is applicable. For example, suppose you have a list of items (say, a collaborative todo list) and you have a way to fetch items that have been updated after a certain time. Then, you don't have to refetch the whole todo list to get updates: you can just incorporate the newly added items with `fetchMore`, as long as your `updateQuery` function correctly merges the new results.

<h3 id="connection-directive">The `@connection` directive</h3>

Fundamentally, paginated queries are the same as any other query with the exception that calls to `fetchMore` update the same cache key. Since these queries are cached by both the initial query and their parameters, a problem arises when later retrieving or updating paginated queries in the cache. We don’t care about pagination arguments such as limits, offsets, or cursors outside of the need to `fetchMore`, nor do we want to provide them simply for accessing cached data.

To solve this Apollo Client 1.6 introduced the `@connection` directive to specify a custom store key for results. A connection allows us to set the cache key for a field and to filter which arguments actually alter the query.

To use the `@connection` directive, simply add the directive to the segment of the query you want a custom store key for and provide the `key` parameter to specify the store key. In addition to the `key` parameter, you can also include the optional `filter` parameter, which takes an array of query argument names to include in the generated custom store key.

```
const query = gql`query Feed($type: FeedType!, $offset: Int, $limit: Int) {
  feed(type: $type, offset: $offset, limit: $limit) @connection(key: "feed", filter: ["type"]) {
    ...FeedEntry
  }
}`
```

With the above query, even with multiple `fetchMore`s, the results of each feed update will always result in the `feed` key in the store being updated with the latest accumulated values. In this example, we also use the `@connection` directive's optional `filter` argument to include the `type` query argument in the store key, which results in multiple store values that accumulate queries from each type of feed.

Now that we have a stable store key, we can easily use `writeQuery` to perform a store update, in this case clearing out the feed.

```
client.writeQuery({
  query: gql`
    query Feed($type: FeedType!) {
      feed(type: $type) @connection(key: "feed", filter: ["type"]) {
        id
      }
    }
  `,
  variables: {
    type: "top",
  },
  data: {
    feed: [],
  },
});
```

Note that because we are only using the `type` argument in the store key, we don't have to provide `offset` or `limit`.

<h3 id="cacheRedirect">Cache redirects with `cacheRedirects`</h3>

In some cases, a query requests data that already exists in the client store under a different key. A very common example of this is when your UI has a list view and a detail view that both use the same data. The list view might run the following query:

```
query ListView {
  books {
    id
    title
    abstract
  }
}
```

When a specific book is selected, the detail view displays an individual item using this query:

```
query DetailView {
  book(id: $id) {
    id
    title
    abstract
  }
}
```

> Note: The data returned by the list query has to include all the data the specific query needs. If the specific book query fetches a field that the list query doesn't return Apollo Client cannot return the data from the cache.

We know that the data is most likely already in the client cache, but because it's requested with a different query, Apollo Client doesn't know that. In order to tell Apollo Client where to look for the data, we can define custom resolvers:

```
import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      book: (_, args, { getCacheKey }) =>
        getCacheKey({ __typename: 'Book', id: args.id })
    },
  },
});
```

> Note: This'll also work with custom `dataIdFromObject` methods as long as you use the same one.

Apollo Client will use the ID returned by the custom resolver to look up the item in its cache. `getCacheKey` is passed inside the third argument to the resolver to generate the key of the object based on its `__typename` and `id`.

To figure out what you should put in the `__typename` property run one of the queries in GraphiQL and get the `__typename` field:

```
query ListView {
  books {
    __typename
  }
}

# or

query DetailView {
  book(id: $id) {
    __typename
  }
}
```

The value that's returned (the name of your type) is what you need to put into the `__typename` property.

It is also possible to return a list of IDs:

```
cacheRedirects: {
  Query: {
    books: (_, args, { getCacheKey }) =>
      args.ids.map(id =>
        getCacheKey({ __typename: 'Book', id: id }))
  }
}
```

<h3 id="reset-store">Resetting the store</h3>

Sometimes, you may want to reset the store entirely, such as [when a user logs out](../recipes/authentication.html#login-logout). To accomplish this, use `client.resetStore` to clear out your Apollo cache. Since `client.resetStore` also refetches any of your active queries for you, it is asynchronous.

```js
export default withApollo(
  graphql(PROFILE_QUERY, {
    props: ({ data: { loading, currentUser }, ownProps: { client } }) => ({
      loading,
      currentUser,
      resetOnLogout: async () => client.resetStore()
    })
  })(Profile)
);
```

To register a callback function to be executed after the store has been reset, call `client.onResetStore` and pass in your callback. If you would like to register multiple callbacks, simply call `client.onResetStore` again. All of your callbacks will be pushed into an array and executed concurrently.

In this example, we're using `client.onResetStore` to write our default values to the cache for [`apollo-link-state`](/docs/link/links/state.html). This is necessary if you're using `apollo-link-state` for local state management and calling `client.resetStore` anywhere in your application.

```js
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { withClientState } from "apollo-link-state";

import { resolvers, defaults } from "./resolvers";

const cache = new InMemoryCache();
const stateLink = withClientState({ cache, resolvers, defaults });

const client = new ApolloClient({
  cache,
  link: stateLink
});

client.onResetStore(stateLink.writeDefaults);
```

You can also call `client.onResetStore` from your React components. This can be useful if you would like to force your UI to rerender after the store has been reset.

If you would like to unsubscribe your callbacks from resetStore, use the return value of `client.onResetStore` for your unsubscribe function.

```js
import { withApollo } from "react-apollo";

export class Foo extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = props.client.onResetStore(() =>
      this.setState({ reset: false })
    );
    this.state = { reset: false };
  }
  componentDidUnmount() {
    this.unsubscribe();
  }
  render() {
    return this.state.reset ? <div /> : <span />;
  }
}

export default withApollo(Foo);
```

If you want to clear the store but don't want to refetch active queries, use
`client.clearStore()` instead of `client.resetStore()`.

<h3 id="server">Server side rendering</h3>

First, you will need to initialize an `InMemoryCache` on the server and create an instance of `ApolloClient`. In the initial serialized HTML payload from the server, you should include a script tag that extracts the data from the cache. (The `.replace()` is necessary to prevent script injection attacks)

```js
`<script>
  window.__APOLLO_STATE__=${JSON.stringify(cache.extract()).replace(
    /</g,
    "\\u003c"
  )}
</script>`;
```

On the client, you can rehydrate the cache using the initial data passed from the server:

```js
cache: new Cache().restore(window.__APOLLO_STATE__);
```

If you would like to learn more about server side rendering, please check our our more in depth guide [here](../features/server-side-rendering.html).

<h3 id="persistence">Cache persistence</h3>

If you would like to persist and rehydrate your Apollo Cache from a storage provider like `AsyncStorage` or `localStorage`, you can use [`apollo-cache-persist`](https://github.com/apollographql/apollo-cache-persist). `apollo-cache-persist` works with all Apollo caches, including `InMemoryCache` & `Hermes`, and a variety of different [storage providers](https://github.com/apollographql/apollo-cache-persist#storage-providers).

To get started, simply pass your Apollo Cache and a storage provider to `persistCache`. By default, the contents of your Apollo Cache will be immediately restored asynchronously, and persisted upon every write to the cache with a short configurable debounce interval.

> Note: The `persistCache` method is async and returns a `Promise`.

```js
import { AsyncStorage } from "react-native";
import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";

const cache = new InMemoryCache();

persistCache({
  cache,
  storage: AsyncStorage
}).then(() => {
  // Continue setting up Apollo as usual.
});
```

## For more advanced usage, such as persisting the cache when the app is in the background, and additional configuration options, please check the [README of `apollo-cache-persist`](https://github.com/apollographql/apollo-cache-persist).

title: Using fragments
description: Learn how to use fragments to share fields across queries

---

A [GraphQL fragment](http://graphql.org/learn/queries/#fragments) is a shared piece of query logic.

```graphql
fragment NameParts on Person {
  firstName
  lastName
}

query GetPerson {
  people(id: "7") {
    ...NameParts
    avatar(size: LARGE)
  }
}
```

It's important to note that the component after the `on` clause is designated for the type we are selecting from. In this case, `people` is of type `Person` and we want to select the `firstName` and `lastName` fields from `people(id: "7")`.

There are two principal uses for fragments in Apollo:

- Sharing fields between multiple queries, mutations or subscriptions.
- Breaking your queries up to allow you to co-locate field access with the places they are used.

In this document we'll outline patterns to do both; we'll also make use of utilities in the [`graphql-anywhere`](https://github.com/apollographql/apollo-client) and [`graphql-tag`](https://github.com/apollographql/graphql-tag) packages which aim to help us, especially with the second problem.

<h2 id="reusing-fragments">Reusing fragments</h2>

The most straightforward use of fragments is to reuse parts of queries (or mutations or subscriptions) in various parts of your application. For instance, in GitHunt on the comments page, we want to fetch the same fields after posting a comment as we originally query. This way we can be sure that we render consistent comment objects as the data changes.

To do so, we can simply share a fragment describing the fields we need for a comment:

```js
import gql from "graphql-tag";

CommentsPage.fragments = {
  comment: gql`
    fragment CommentsPageComment on Comment {
      id
      postedBy {
        login
        html_url
      }
      createdAt
      content
    }
  `
};
```

We put the fragment on `CommentsPage.fragments.comment` by convention, and use the familiar `gql` helper to create it.

When it's time to embed the fragment in a query, we simply use the `...Name` syntax in our GraphQL, and embed the fragment inside our query GraphQL document:

```js
const SUBMIT_COMMENT_MUTATION = gql`
  mutation SubmitComment($repoFullName: String!, $commentContent: String!) {
    submitComment(
      repoFullName: $repoFullName
      commentContent: $commentContent
    ) {
      ...CommentsPageComment
    }
  }
  ${CommentsPage.fragments.comment}
`;

export const COMMENT_QUERY = gql`
  query Comment($repoName: String!) {
    # ...
    entry(repoFullName: $repoName) {
      # ...
      comments {
        ...CommentsPageComment
      }
      # ...
    }
  }
  ${CommentsPage.fragments.comment}
`;
```

You can see the full source code to the `CommentsPage` in GitHunt [here](https://github.com/apollographql/GitHunt-React/blob/master/src/routes/CommentsPage.js).

<h2 id="colocating-fragments">Colocating fragments</h2>

A key advantage of GraphQL is the tree-like nature of the response data, which in many cases mirrors your rendered component hierarchy. This, combined with GraphQL's support for fragments, allows you to split your queries up in such a way that the various fields fetched by the queries are located right alongside the code that uses the field.

Although this technique doesn't always make sense (for instance it's not always the case that the GraphQL schema is driven by the UI requirements), when it does, it's possible to use some patterns in Apollo client to take full advantage of it.

In GitHunt, we show an example of this on the [`FeedPage`](https://github.com/apollographql/GitHunt-React/blob/master/src/routes/FeedPage.js), which constructs the follow view hierarchy:

```
FeedPage
└── Feed
    └── FeedEntry
        ├── RepoInfo
        └── VoteButtons
```

The `FeedPage` conducts a query to fetch a list of `Entry`s, and each of the subcomponents requires different subfields of each `Entry`.

The `graphql-anywhere` package gives us tools to easily construct a single query that provides all the fields that each subcomponent needs, and allows to easily pass the exact field that a component needs to it.

<h3 id="creating-fragments">Creating fragments</h3>

To create the fragments, we again use the `gql` helper and attach to subfields of `ComponentClass.fragments`, for example:

```js
VoteButtons.fragments = {
  entry: gql`
    fragment VoteButtons on Entry {
      score
      vote {
        vote_value
      }
    }
  `
};
```

If our fragments include sub-fragments then we can pass them into the `gql` helper:

```js
FeedEntry.fragments = {
  entry: gql`
    fragment FeedEntry on Entry {
      commentCount
      repository {
        full_name
        html_url
        owner {
          avatar_url
        }
      }
      ...VoteButtons
      ...RepoInfo
    }
    ${VoteButtons.fragments.entry}
    ${RepoInfo.fragments.entry}
  `
};
```

<h3 id="filtering-with-fragments">Filtering with fragments</h3>

We can also use the `graphql-anywhere` package to filter the exact fields from the `entry` before passing them to the subcomponent. So when we render a `VoteButtons`, we can simply do:

```jsx
import { filter } from "graphql-anywhere";

<VoteButtons
  entry={filter(VoteButtons.fragments.entry, entry)}
  canVote={loggedIn}
  onVote={type =>
    onVote({
      repoFullName: full_name,
      type
    })
  }
/>;
```

The `filter()` function will grab exactly the fields from the `entry` that the fragment defines.

<h3 id="webpack-importing-fragments" title="Fragments with Webpack">Importing fragments when using Webpack</h3>

When loading `.graphql` files with [graphql-tag/loader](https://github.com/apollographql/graphql-tag/blob/master/loader.js), we can include fragments using `import` statements. For example:

```graphql
#import "./someFragment.graphql"
```

Will make the contents of `someFragment.graphql` available to the current file. See the [Webpack Fragments](../recipes/webpack.html#Fragments) section for additional details.

<h2 id="fragment-matcher">Fragments on unions and interfaces</h2>

> This is an advanced feature that Apollo Boost does not support. Learn how to set Apollo Client up manually in our [Apollo Boost migration guide](./boost-migration.html).

By default, Apollo Client doesn't require any knowledge of the GraphQL schema, which means it's very easy to set up and works with any server and supports even the largest schemas. However, as your usage of Apollo and GraphQL becomes more sophisticated, you may start using fragments on interfaces or unions. Here's an example of a query that uses fragments on an interface:

```
query {
  all_people {
    ... on Character {
      name
    }
    ... on Jedi {
      side
    }
    ... on Droid {
      model
    }
  }
}

```

In the query above, `all_people` returns a result of type `Character[]`. Both `Jedi` and `Droid` are possible concrete types of `Character`, but on the client there is no way to know that without having some information about the schema. By default, Apollo Client's cache will use a heuristic fragment matcher, which assumes that a fragment matched if the result included all the fields in its selection set, and didn't match when any field was missing. This works in most cases, but it also means that Apollo Client cannot check the server response for you, and it cannot tell you when you're manually writing an invalid data into the store using `update`, `updateQuery`, `writeQuery`, etc.

The section below explains how to pass the necessary schema knowledge to the Apollo Client cache so unions and interfaces can be accurately matched and results validated before writing them into the store.

To support result validation and accurate fragment matching on unions and interfaces, a special fragment matcher called the `IntrospectionFragmentMatcher` can be used. If there are any changes related to union or interface types in your schema, you will have to update the fragment matcher accordingly.

We recommend setting up a build step that extracts the necessary information from the schema into a JSON file, where it can be imported from when constructing the fragment matcher. To set it up, follow the three steps below:

1. Query your server / schema to obtain the necessary information about unions and interfaces and write it to a file. You can set this up as a script to run at build time.

```js
const fetch = require("node-fetch");
const fs = require("fs");

fetch(`${YOUR_API_HOST}/graphql`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    variables: {},
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `
  })
})
  .then(result => result.json())
  .then(result => {
    // here we're filtering out any type information unrelated to unions or interfaces
    const filteredData = result.data.__schema.types.filter(
      type => type.possibleTypes !== null
    );
    result.data.__schema.types = filteredData;
    fs.writeFile("./fragmentTypes.json", JSON.stringify(result.data), err => {
      if (err) {
        console.error("Error writing fragmentTypes file", err);
      } else {
        console.log("Fragment types successfully extracted!");
      }
    });
  });
```

2. Create a new IntrospectionFragment matcher by passing in the `fragmentTypes.json` file you just created. You'll want to do this in the same file where you initialize the cache for Apollo Client.

```js
import { IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import introspectionQueryResultData from "./fragmentTypes.json";

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});
```

3. Pass in the newly created `IntrospectionFragmentMatcher` to configure your cache during construction. Then, you pass your newly configured cache to `ApolloClient` to complete the process.

```js
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";

// add fragmentMatcher code from step 2 here

const cache = new InMemoryCache({ fragmentMatcher });

const client = new ApolloClient({
  cache,
  link: new HttpLink()
});
```

---

## title: Authentication

Unless all of the data you are loading is completely public, your app has some sort of users, accounts and permissions systems. If different users have different permissions in your application, then you need a way to tell the server which user is associated with each request.

Apollo Client uses the ultra flexible [Apollo Link](/docs/link) that includes several options for authentication.

## Cookie

If your app is browser based and you are using cookies for login and session management with a backend, it's very easy to tell your network interface to send the cookie along with every request. You just need to pass the credentials option. e.g. `credentials: 'same-origin'` as shown below, if your backend server is the same domain or else `credentials: 'include'` if your backend is a different domain.

```js
const link = createHttpLink({
  uri: "/graphql",
  credentials: "same-origin"
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
});
```

This option is simply passed through to the [`fetch` implementation](https://github.com/github/fetch) used by the HttpLink when sending the query.

Note: the backend must also allow credentials from the requested origin. e.g. if using the popular 'cors' package from npm in node.js, the following settings would work in tandem with the above apollo client settings,

```js
// enable cors
var corsOptions = {
  origin: "<insert uri of front-end domain>",
  credentials: true // <-- REQUIRED backend setting
};
app.use(cors(corsOptions));
```

## Header

Another common way to identify yourself when using HTTP is to send along an authorization header. It's easy to add an `authorization` header to every HTTP request by chaining together Apollo Links. In this example, we'll pull the login token from `localStorage` every time a request is sent:

```js
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";

const httpLink = createHttpLink({
  uri: "/graphql"
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
```

Note that the above example is using `ApolloClient` from the `apollo-client` package. Headers can still be modified using `ApolloClient` from the `apollo-boost` package, but since `apollo-boost` doesn't allow the `HttpLink` instance it uses to be modified, headers have to be passed in as a config parameter. See the Apollo Boost [Configuration options](../essentials/get-started.html#configuration) section for more details.

The server can use that header to authenticate the user and attach it to the GraphQL execution context, so resolvers can modify their behavior based on a user's role and permissions.

<h2 id="login-logout">Reset store on logout</h2>

Since Apollo caches all of your query results, it's important to get rid of them when the login state changes.

The easiest way to ensure that the UI and store state reflects the current user's permissions is to call `client.resetStore()` after your login or logout process has completed. This will cause the store to be cleared and all active queries to be refetched. If you just want the store to be cleared and don't want to refetch active queries, use `client.clearStore()` instead. Another option is to reload the page, which will have a similar effect.

```js
const PROFILE_QUERY = gql`
  query CurrentUserForLayout {
    currentUser {
      login
      avatar_url
    }
  }
`;

const Profile = () => (
  <Query query={PROFILE_QUERY} fetchPolicy="network-only">
    {({ client, loading, data: { currentUser } }) => {
      if (loading) {
        return <p className="navbar-text navbar-right">Loading...</p>;
      }
      if (currentUser) {
        return (
          <span>
            <p className="navbar-text navbar-right">
              {currentUser.login}
              &nbsp;
              <button
                onClick={() => {
                  // call your auth logout code then reset store
                  App.logout().then(() => client.resetStore());
                }}
              >
                Log out
              </button>
            </p>
          </span>
        );
      }
      return (
        <p className="navbar-text navbar-right">
          <a href="/login/github">Log in with GitHub</a>
        </p>
      );
    }}
  </Query>
);
```

---

title: Testing React components
description: Have peace of mind when using react-apollo in production

---

Running tests against code meant for production has long been a best practice. It provides additional security for the code that's already written, and prevents accidental regressions in the future. Components utilizing `react-apollo`, the React implementation of Apollo Client, are no exception.

Although `react-apollo` has a lot going on under the hood, the library provides multiple tools for testing that simplify those abstractions, and allows complete focus on the component logic. These testing utilities have long been used to test the `react-apollo` library itself, so they will be supported long-term.

## An introduction

The `react-apollo` library relies on [context](https://reactjs.org/docs/context.html) in order to pass the `ApolloClient` instance through the React component tree. In addition, `react-apollo` makes network requests in order to fetch data. This behavior affects how tests should be written for components that use `react-apollo`.

This guide will explain step-by-step how to test `react-apollo` code. The following examples use the [Jest](https://facebook.github.io/jest/docs/en/tutorial-react.html) testing framework, but most concepts should be reusable with other libraries. These examples aim to use as simple of a toolset as possible, so React's [test renderer](https://reactjs.org/docs/test-renderer.html) will be used in place of React-specific tools like [Enzyme](https://github.com/airbnb/enzyme) and [react-testing-library](https://github.com/kentcdodds/react-testing-library).

Consider the component below, which makes a basic query, and displays its results:

```js
import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

// Make sure the query is also exported -- not just the component
export const GET_DOG_QUERY = gql`
  query getDog($name: String) {
    dog(name: $name) {
      id
      name
      breed
    }
  }
`;

export const Dog = ({ name }) => (
  <Query query={GET_DOG_QUERY} variables={{ name }}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error!`;

      return (
        <p>
          {data.dog.name} is a {data.dog.breed}
        </p>
      );
    }}
  </Query>
);
```

Given this component, let's try to render it inside a test, just to make sure there are no render errors:

```js
// Broken because it's missing Apollo Client in the context
it("should render without error", () => {
  renderer.create(<Dog name="Buck" />);
});
```

This test would produce an error because Apollo Client isn't available on the context for the `Query` component to consume.

In order to fix this we could wrap the component in an `ApolloProvider` and pass an instance of Apollo Client to the `client` prop. However, this will cause the tests to run against an actual backend which makes the tests very unpredictable for the following reasons:

- The server could be down.
- There may be no network connection.
- The results are not guaranteed to be the same for every query.

```js
// Not predictable
it("renders without error", () => {
  renderer.create(
    <ApolloProvider client={client}>
      <Dog name="Buck" />
    </ApolloProvider>
  );
});
```

## `MockedProvider`

The `react-apollo/test-utils` module exports a `MockedProvider` component which simplifies the testing of React components by mocking calls to the GraphQL endpoint. This allows the tests to be run in isolation and provides consistent results on every run by removing the dependence on remote data.

By using this `MockedProvider` component, it's possible to specify the exact results that should be returned for a certain query using the `mocks` prop.

Here's an example of a test for the above `Dog` component using `MockedProvider`, which shows how to define the mocked response for `GET_DOG_QUERY`:

```js
// dog.test.js

import { MockedProvider } from "react-apollo/test-utils";

// The component AND the query need to be exported
import { GET_DOG_QUERY, Dog } from "./dog";

const mocks = [
  {
    request: {
      query: GET_DOG_QUERY,
      variables: {
        name: "Buck"
      }
    },
    result: {
      data: {
        dog: { id: "1", name: "Buck", breed: "bulldog" }
      }
    }
  }
];

it("renders without error", () => {
  renderer.create(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Dog name="Buck" />
    </MockedProvider>
  );
});
```

The `mocks` array takes objects with specific `request`s and their associated `result`s. When the provider receives a `GET_DOG_QUERY` with matching `variables`, it returns the corresponding object from the `result` key.

### `addTypename`

You may notice the prop being passed to the `MockedProvider` called `addTypename`. The reason this is here is because of how Apollo Client normally works. When a request is made with Apollo Client normally, it adds a `__typename` field to every object type requested. This is to make sure that Apollo Client's cache knows how to normalize and store the response. When we're making our mocks, though, we're importing the raw queries _without typenames_ from the component files.

If we don't disable the adding of typenames to queries, the imported query won't match the query actually being run by the component during our tests.

> In short, if queries are lacking `__typename`, it's important to pass the `addTypename={false}` prop to the `MockedProvider`s.

## Testing loading states

In this example, the `Dog` component will render, but it will render in a loading state, not the final response state. This is because `MockedProvider` doesn't just return the data but instead returns a `Promise` that will resolve to that data. By using a `Promise` it enables testing of the loading state in addition to the final state:

```js
it("should render loading state initially", () => {
  const component = renderer.create(
    <MockedProvider mocks={[]}>
      <Dog />
    </MockedProvider>
  );

  const tree = component.toJSON();
  expect(tree.children).toContain("Loading...");
});
```

This shows a basic example test that tests the loading state of a component by checking that the children of the component contain the text `Loading...`. In an actual application, this test would probably be more complicated, but the testing logic would be the same.

## Testing final state

Loading state, while important, isn't the only thing to test. To test the final state of the component after receiving data, we can just wait for it to update and test the final state.

```js
const wait = require("waait");

it("should render dog", async () => {
  const dogMock = {
    request: {
      query: GET_DOG_QUERY,
      variables: { name: "Buck" }
    },
    result: {
      data: { dog: { id: 1, name: "Buck", breed: "poodle" } }
    }
  };

  const component = renderer.create(
    <MockedProvider mocks={[dogMock]} addTypename={false}>
      <Dog name="Buck" />
    </MockedProvider>
  );

  await wait(0); // wait for response

  const p = component.root.findByType("p");
  expect(p.children).toContain("Buck is a poodle");
});
```

Here, you can see the `await wait(0)` line. This is a utility function from the [`waait`](https://npm.im/waait) npm package. It delays until the next "tick" of the event loop, and allows time for that `Promise` returned from `MockedProvider` to be fulfilled. After that `Promise` resolves (or rejects), the component can be checked to ensure it displays the correct information — in this case, "Buck is a poodle".

For more complex UI with heavy calculations, or delays added into its render logic, the `wait(0)` will not be long enough. In these cases, you could either increase the wait time or use a package like [`wait-for-expect`](https://npm.im/wait-for-expect) to delay until the render has happened. The risk of using a package like this everywhere by default is that _every_ test could take up to five seconds to execute (or longer if the default timeout has been increased).

## Testing error states

Since they can make or break the experience a user has when interacting with the app, error states are one of the most important states to test, but are often less tested in development.

Since most developers would follow the "happy path" and not encounter these states as often, it's almost _more_ important to test these states to prevent accidental regressions.

To simulate a network error, an `error` property can be included on the mock, in place of or in addition to the `result`.

```js
it("should show error UI", async () => {
  const dogMock = {
    request: {
      query: GET_DOG_QUERY,
      variables: { name: "Buck" }
    },
    error: new Error("aw shucks")
  };

  const component = renderer.create(
    <MockedProvider mocks={[dogMock]} addTypename={false}>
      <Dog name="Buck" />
    </MockedProvider>
  );

  await wait(0); // wait for response

  const tree = component.toJSON();
  expect(tree.children).toContain("Error!");
});
```

Here, whenever the `MockedProvider` receives a `GET_DOG_QUERY` with matching `variables`, it will return the error assigned to the `error` property in the mock. This forces the component into the error state, allowing verification that it's being handled gracefully.

To simulate GraphQL errors, simply define `errors` along with any data in your result.

```js
const dogMock = {
  // ...
  result: {
    errors: [{ message: "Error!" }]
  }
};
```

## Testing mutation components

`Mutation` components are tested very similarly to `Query` components. The only key difference is how the operation is fired. On a `Query` component, the query is fired when the component _mounts_, whereas with `Mutation` components, the mutation is fired manually, usually after some user interaction like pressing a button.

Consider this component that calls a mutation:

```js
export const DELETE_DOG_MUTATION = gql`
  mutation deleteDog($name: String!) {
    deleteDog(name: $name) {
      id
      name
      breed
    }
  }
`;

export const DeleteButton = () => (
  <Mutation mutation={DELETE_DOG_MUTATION}>
    {(mutate, { loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error!</p>;
      if (data) return <p>Deleted!</p>;

      return (
        <button onClick={() => mutate({ variables: { name: "Buck" } })}>
          Click me to Delete Buck!
        </button>
      );
    }}
  </Mutation>
);
```

Testing an initial render for this component looks identical to testing our `Query` component.

```js
import DeleteButton, { DELETE_DOG_MUTATION } from "./delete-dog";

it("should render without error", () => {
  renderer.create(
    <MockedProvider mocks={[]}>
      <DeleteButton />
    </MockedProvider>
  );
});
```

Calling the mutation is where things get interesting:

```js
it("should render loading state initially", () => {
  const deleteDog = { name: "Buck", breed: "Poodle", id: 1 };
  const mocks = [
    {
      request: {
        query: DELETE_DOG_MUTATION,
        variables: { name: "Buck" }
      },
      result: { data: { deleteDog } }
    }
  ];

  const component = renderer.create(
    <MockedProvider mocks={mocks} addTypename={false}>
      <DeleteButton />
    </MockedProvider>
  );

  // find the button and simulate a click
  const button = component.root.findByType("button");
  button.props.onClick(); // fires the mutation

  const tree = component.toJSON();
  expect(tree.children).toContain("Loading...");
});
```

This example looks very similar to the `Query` component, but the difference comes after the rendering is completed. Since this component relies on a button to be clicked to fire a mutation, the renderer's API is used to find the button.

After a reference to the button has been obtained, a "click" on the button can be simulated by calling its `onClick` handler. This will fire off the mutation, and then the rest will be tested identically to the `Query` component.

> Note: Other test utilities like [Enzyme](https://github.com/airbnb/enzyme) and [react-testing-library](https://github.com/kentcdodds/react-testing-library) have built-in tools for finding elements and simulating events, but the concept is the same: find the button and simulate a click on it.

To test for a successful mutation after simulating the click, the fulfilled `Promise` from `MockedProvider` can be checked for the appropriate confirmation message, just like the `Query` component:

```js
it("should delete and give visual feedback", async () => {
  const deleteDog = { name: "Buck", breed: "Poodle", id: 1 };
  const mocks = [
    {
      request: {
        query: DELETE_DOG_MUTATION,
        variables: { name: "Buck" }
      },
      result: { data: { deleteDog } }
    }
  ];

  const component = renderer.create(
    <MockedProvider mocks={mocks} addTypename={false}>
      <DeleteButton />
    </MockedProvider>
  );

  // find the button and simulate a click
  const button = component.root.findByType("button");
  button.props.onClick(); // fires the mutation

  await wait(0);

  const tree = component.toJSON();
  expect(tree.children).toContain("Deleted!");
});
```

For the sake of simplicity, the error case for mutations hasn't been shown here, but testing `Mutation` errors is exactly the same as testing `Query` errors: just add an `error` to the mock, fire the mutation, and check the UI for error messages.

Testing UI components isn't a simple issue, but hopefully these tools will create confidence when testing components that are dependent on data.

For a working example showing how to test components, check out this project on CodeSandbox:

[![Edit React-Apollo Testing](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/40k7j708n4)

## <!-- Refer to the [docs](../api/react-apollo.html#MockedProvider) for more information on the API for `<MockedProvider />`. -->

title: Using Apollo with TypeScript
sidebar_title: Using TypeScript

---

**Note: Apollo no longer ships with Flow types. If you want to help contribute to add these, please reach out!**

As your application grows, you may find it helpful to include a type system to assist in development. Apollo supports type definitions for TypeScript out of the box. Both `apollo-client` and `react-apollo` ship with definitions in their npm packages, so installation should be done for you after the libraries are included in your project.

These docs assume you already have TypeScript configured in your project, if not start [here](https://github.com/Microsoft/TypeScript-React-Conversion-Guide#typescript-react-conversion-guide).

The most common need when using type systems with GraphQL is to type the results of an operation. Given that a GraphQL server's schema is strongly typed, we can even generate TypeScript definitions automatically using a tool like [apollo-codegen](https://github.com/apollographql/apollo-codegen). In these docs however, we will be writing result types manually.

<h2 id="typing-components">Typing the Component APIs</h2>

Using Apollo together with TypeScript couldn't be easier than using it with component API released in React Apollo 2.1:

```js
interface Data {
  allPeople: {
    people: Array<{ name: string }>
  };
}

interface Variables {
  first: number;
}

class AllPeopleQuery extends Query<Data, Variables> {}
```

Now we can use `AllPeopleQuery` in place of `Query` in our tree to get full TypeScript support! Since we are not mapping any props coming into our component, nor are we rewriting the props passed down, we only need to provide the shape of our data and the variables required for it to work! Everything else is handled by React Apollo's robust type definitions.

This approach is the exact same for the `<Query />`, `<Mutation />`, and `<Subcription />` components! Learn it once, and get the best types ever with Apollo.

<h2 id="operation-result">Typing the Higher Order Components</h2>

Since the result of a query will be sent to the wrapped component as props, we want to be able to tell our type system the shape of those props. Here is an example setting types for an operation using the `graphql` higher order component (**note**: the follow sections also work for the query, mutation, and subscription hocs):

```javascript
import React from "react";
import gql from "graphql-tag";
import { ChildDataProps, graphql } from "react-apollo";

const HERO_QUERY = gql`
  query GetCharacter($episode: Episode!) {
    hero(episode: $episode) {
      name
      id
      friends {
        name
        id
        appearsIn
      }
    }
  }
`;

type Hero = {
  name: string;
  id: string;
  appearsIn: string[];
  friends: Hero[];
};

type Response = {
  hero: Hero;
};

type Variables = {
  episode: string;
};

type ChildProps = ChildDataProps<{}, Response, Variables>;

// Note that the first parameter here is an empty Object, which means we're
// not checking incoming props for type safety in this example. The next
// example (in the "Options" section) shows how the type safety of incoming
// props can be ensured.
const withCharacter = graphql<{}, Response, Variables, ChildProps>(HERO_QUERY, {
  options: () => ({
    variables: { episode: "JEDI" }
  })
});

export default withCharacter(({ data: { loading, hero, error } }) => {
  if (loading) return <div>Loading</div>;
  if (error) return <h1>ERROR</h1>;
  return ...// actual component with data;
});
```

<h3 id="options">Options</h3>

Typically, variables to the query will be computed from the props of the wrapper component. Wherever the component is used in your application, the caller would pass arguments that we want our type system to validate what the shape of these props could look like. Here is an example setting the type of props:

```javascript
import React from "react";
import gql from "graphql-tag";
import { ChildDataProps, graphql } from "react-apollo";

const HERO_QUERY = gql`
  query GetCharacter($episode: Episode!) {
    hero(episode: $episode) {
      name
      id
      friends {
        name
        id
        appearsIn
      }
    }
  }
`;

type Hero = {
  name: string;
  id: string;
  appearsIn: string[];
  friends: Hero[];
};

type Response = {
  hero: Hero;
};

type InputProps = {
  episode: string;
};

type Variables = {
  episode: string;
};

type ChildProps = ChildDataProps<InputProps, Response, Variables>;

const withCharacter = graphql<InputProps, Response, Variables, ChildProps>(HERO_QUERY, {
  options: ({ episode }) => ({
    variables: { episode }
  }),
});

export default withCharacter(({ data: { loading, hero, error } }) => {
  if (loading) return <div>Loading</div>;
  if (error) return <h1>ERROR</h1>;
  return ...// actual component with data;
});
```

This is especially helpful when accessing deeply nested objects that are passed down to the component through props. For example, when adding prop types, a project using TypeScript will begin to surface errors where props being passed are invalid:

```javascript
import React from "react";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";

import Character from "./Character";

export const link = createHttpLink({
  uri: "https://mpjk0plp9.lp.gql.zone/graphql"
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
});

export default () => (
  <ApolloProvider client={client}>
    // $ExpectError property `episode`. Property not found in. See:
    src/Character.js:43
    <Character />
  </ApolloProvider>
);
```

<h3 id="props">Props</h3>

One of the most powerful feature of the React integration is the `props` function which allows you to reshape the result data from an operation into a new shape of props for the wrapped component. GraphQL is awesome at allowing you to only request the data you want from the server. The client still often needs to reshape or do client side calculations based on these results. The return value can even differ depending on the state of the operation (i.e loading, error, recieved data), so informing our type system of choice of these possible values is really important to make sure our components won't have runtime errors.

The `graphql` wrapper from `react-apollo` supports manually declaring the shape of your result props.

```javascript
import React from "react";
import gql from "graphql-tag";
import { graphql, ChildDataProps } from "react-apollo";

const HERO_QUERY = gql`
  query GetCharacter($episode: Episode!) {
    hero(episode: $episode) {
      name
      id
      friends {
        name
        id
        appearsIn
      }
    }
  }
`;

type Hero = {
  name: string;
  id: string;
  appearsIn: string[];
  friends: Hero[];
};

type Response = {
  hero: Hero;
};

type InputProps = {
  episode: string
};

type Variables = {
  episode: string
};

type ChildProps = ChildDataProps<InputProps, Response, Variables>;

const withCharacter = graphql<InputProps, Response, Variables, ChildProps>(HERO_QUERY, {
  options: ({ episode }) => ({
    variables: { episode }
  }),
  props: ({ data }) => ({ ...data })
});

export default withCharacter(({ loading, hero, error }) => {
  if (loading) return <div>Loading</div>;
  if (error) return <h1>ERROR</h1>;
  return ...// actual component with data;
});
```

Since we have typed the response shape, the props shape, and the shape of what will be passed to the client, we can prevent errors in multiple places. Our options and props function within the `graphql` wrapper are now type safe, our rendered component is protected, and our tree of components have their required props enforced.

```javascript
export const withCharacter = graphql<InputProps, Response, Variables, Props>(HERO_QUERY, {
  options: ({ episode }) => ({
    variables: { episode }
  }),
  props: ({ data, ownProps }) => ({
    ...data,
    // $ExpectError [string] This type cannot be compared to number
    episode: ownProps.episode > 1,
    // $ExpectError property `isHero`. Property not found on object type
    isHero: data && data.hero && data.hero.isHero
  })
});
```

With this addition, the entirety of the integration between Apollo and React can be statically typed. When combined with the strong tooling each system provides, it can make for a much improved application and developer experience.

<h3 id="classes-vs-functions">Classes vs Functions</h3>

All of the above examples show wrapping a component which is just a function using the result of a `graphql` wrapper. Sometimes, components that depend on GraphQL data require state and are formed using the `class MyComponent extends React.Component` practice. In these use cases, TypeScript requires adding prop shape to the class instance. In order to support this, `react-apollo` exports types to support creating result types easily.

```javascript
import { ChildProps } from "react-apollo";

const withCharacter = graphql<InputProps, Response>(HERO_QUERY, {
  options: ({ episode }) => ({
    variables: { episode }
  })
});

class Character extends React.Component<ChildProps<InputProps, Response>, {}> {
  render(){
    const { loading, hero, error } = this.props.data;
    if (loading) return <div>Loading</div>;
    if (error) return <h1>ERROR</h1>;
    return ...// actual component with data;
  }
}

export default withCharacter(Character);
```

<h3 id="using-name">Using the `name` property</h3>
If you are using the `name` property in the configuration of the `graphql` wrapper, you will need to manually attach the type of the response to the `props` function. An example using TypeScript would be like this:

```javascript
import { NamedProps, QueryProps } from 'react-apollo';

export const withCharacter = graphql<InputProps, Response, {}, Prop>(HERO_QUERY, {
  name: 'character',
  props: ({ character, ownProps }: NamedProps<{ character: QueryProps & Response }, Props) => ({
    ...character,
    // $ExpectError [string] This type cannot be compared to number
    episode: ownProps.episode > 1,
    // $ExpectError property `isHero`. Property not found on object type
    isHero: character && character.hero && character.hero.isHero
  })
});
```

---

## title: Improving performance

<h2 id="cache-redirects">Redirecting to cached data</h2>

In some cases, a query requests data that already exists in the client store under a different key. A very common example of this is when your UI has a list view and a detail view that both use the same data. The list view might run the following query:

```
query ListView {
  books {
    id
    title
    abstract
  }
}
```

When a specific book is selected, the detail view displays an individual item using this query:

```
query DetailView {
  book(id: $id) {
    id
    title
    abstract
  }
}
```

> Note: The data returned by the list query has to include all the data the specific query needs. If the specific book query fetches a field that the list query doesn't return Apollo Client cannot return the data from the cache.

We know that the data is most likely already in the client cache, but because it's requested with a different query, Apollo Client doesn't know that. In order to tell Apollo Client where to look for the data, we can define custom resolvers:

```js
import { toIdValue } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";

const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      book: (_, args) =>
        toIdValue(
          cache.config.dataIdFromObject({ __typename: "Book", id: args.id })
        )
    }
  }
});
```

> Note: This'll also work with custom `dataIdFromObject` methods as long as you use the same one.

Apollo Client will use the return value of the custom resolver to look up the item in its cache. `toIdValue` must be used to indicate that the value returned should be interpreted as an id, and not as a scalar value or an object. "Query" key in this example is your root query type name.

To figure out what you should put in the `__typename` property run one of the queries in GraphiQL and get the `__typename` field:

```
query ListView {
  books {
    __typename
  }
}

# or

query DetailView {
  book(id: $id) {
    __typename
  }
}
```

The value that's returned (the name of your type) is what you need to put into the `__typename` property.

It is also possible to return a list of IDs:

```
cacheRedirects: {
  Query: {
    books: (_, args) => args.ids.map(id =>
      toIdValue(cache.config.dataIdFromObject({ __typename: 'Book', id: id }))),
  },
},
```

<h2 id="prefetching">Prefetching data</h2>

Prefetching is one of the easiest ways to make your application's UI feel a lot faster with Apollo Client. Prefetching simply means loading data into the cache before it needs to be rendered on the screen. Essentially, we want to load all data required for a view as soon as we can guess that a user will navigate to it.

We can accomplish this in only a few lines of code by calling `client.query` whenever the user hovers over a link. Let's see this in action in the `Feed` component in our example app [Pupstagram](https://codesandbox.io/s/r5qp83z0yq).

```jsx
const Feed = () => (
  <View style={styles.container}>
    <Header />
    <Query query={GET_DOGS}>
      {({ loading, error, data, client }) => {
        if (loading) return <Fetching />;
        if (error) return <Error />;

        return (
          <DogList
            data={data.dogs}
            renderRow={(type, data) => (
              <Link
                to={{
                  pathname: `/${data.breed}/${data.id}`,
                  state: { id: data.id }
                }}
                onMouseOver={() =>
                  client.query({
                    query: GET_DOG,
                    variables: { breed: data.breed }
                  })
                }
                style={{ textDecoration: "none" }}
              >
                <Dog {...data} url={data.displayImage} />
              </Link>
            )}
          />
        );
      }}
    </Query>
  </View>
);
```

All we have to do is access the client in the render prop function and call `client.query` when the user hovers over the link. Once the user clicks on the link, the data will already be available in the Apollo cache, so the user won't see a loading state.

There are a lot of different ways to anticipate that the user will end up needing some data in the UI. In addition to using the hover state, here are some other places you can preload data:

1. The next step of a multi-step wizard immediately
2. The route of a call-to-action button
3. All of the data for a sub-area of the application, to make navigating within that area instant

If you have some other ideas, please send a PR to this article, and maybe add some more code snippets. A special form of prefetching is [store hydration from the server](./server-side-rendering.html#store-rehydration), so you might also consider hydrating more data than is actually needed for the first page load to make other interactions faster.

<h2 id="query-splitting">Query splitting</h2>

Prefetching is an easy way to make your applications UI feel faster. You can use mouse events to predict the data that could be needed.
This is powerful and works perfectly on the browser, but can not be applied to a mobile device.

One solution for improving the UI experience would be the usage of fragments to preload more data in a query, but loading huge amounts of data (that you probably never show to the user) is expensive.

Another solution would be to split huge queries into two smaller queries:

- The first one could load data which is already in the store. This means that it can be displayed instantly.
- The second query could load data which is not in the store yet and must be fetched from the server first.

This solution gives you the benefit of not fetching too much data, as well as the possibility to show some part of the views data before the server responds.

Lets say you have the following schema:

```graphql
type Series {
  id: Int!
  title: String!
  description: String!
  episodes: [Episode]!
  cover: String!
}

type Episode {
  id: Int!
  title: String!
  cover: String!
}

type Query {
  series: [Series!]!
  oneSeries(id: Int): Series
}
```

And you have two Views:

1. Series Overview: List of all Series with their description and cover
2. Series DetailView: Detail View of a Series with its description, cover and a list of episodes

The query for the Series Overview would look like the following:

```graphql
query SeriesOverviewData {
  series {
    id
    title
    description
    cover
  }
}
```

The queries for the Series DetailView would look like this:

```graphql
query SeriesDetailData($seriesId: Int!) {
  oneSeries(id: $seriesId) {
    id
    title
    description
    cover
  }
}
```

```graphql
query SeriesEpisodes($seriesId: Int!) {
  oneSeries(id: $seriesId) {
    id
    episodes {
      id
      title
      cover
    }
  }
}
```

By adding a [custom resolver](../advanced/caching.html#cacheRedirect) for the `oneSeries` field (and having dataIdFromObject function which normalizes the cache), the data can be resolved instantly from the store without a server round trip.

```javascript
import { ApolloClient } from "apollo-client";
import { toIdValue } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";

const cache = new InMemoryCache({
  cacheResolvers: {
    Query: {
      oneSeries: (_, { id }) =>
        toIdValue(cache.config.dataIdFromObject({ __typename: "Series", id }))
    }
  },
  dataIdFromObject
});

const client = new ApolloClient({
  link, // your link,
  cache
});
```

A component for the second view that implements the two queries could look like this:

```jsx
const QUERY_SERIES_DETAIL_VIEW = gql`
  query SeriesDetailData($seriesId: Int!) {
    oneSeries(id: $seriesId) {
      id
      title
      description
      cover
    }
  }
`;

const QUERY_SERIES_EPISODES = gql`
  query SeriesEpisodes($seriesId: Int!) {
    oneSeries(id: $seriesId) {
      id
      episodes {
        id
        title
        cover
      }
    }
  }
`;

const SeriesDetailView = ({ seriesId }) => (
  <Query query={QUERY_SERIES_DETAIL_VIEW} variables={{ seriesId }}>
    {({ loading: seriesLoading, data: { oneSeries } }) => (
      <Query query={QUERY_SERIES_EPISODES} variables={{ seriesId }}>
        {({
          loading: episodesLoading,
          data: { oneSeries: { episodes } = {} }
        }) => (
          <div>
            <h1>{seriesLoading ? `Loading...` : oneSeries.title}</h1>
            <img src={seriesLoading ? `/dummy.jpg` : oneSeries.cover} />
            <h2>Episodes</h2>
            <ul>
              {episodesLoading ? (
                <li>Loading...</li>
              ) : (
                episodes.map(episode => (
                  <li key={episode.id}>
                    <img src={episode.cover} />
                    <a href={`/episode/${episode.id}`}>{episode.title}</a>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </Query>
    )}
  </Query>
);
```

## Unfortunately if the user would now visit the second view without ever visiting the first view this would result in two network requests (since the data for the first query is not in the store yet). By using a [`BatchedHttpLink`](/docs/link/links/batch-http.html) those two queries can be send to the server in one network request.

## title: Loading queries with Webpack

You can load GraphQL queries over `.graphql` files using Webpack. The package `graphql-tag` comes with a loader easy to setup and with some benefits:

1. Do not process GraphQL ASTs on client-side
2. Enable queries to be separated from logic

In the example below, we create a new file called `currentUser.graphql`:

```graphql
query CurrentUserForLayout {
  currentUser {
    login
    avatar_url
  }
}
```

You can load this file adding a rule in your webpack config file:

```js
module: {
  rules: [
    {
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    },
  ],
},
```

As you can see, `.graphql` or `.gql` files will be parsed whenever imported:

```js
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import currentUserQuery from './currentUser.graphql';

class Profile extends Component { ... }
Profile.propTypes = { ... };

export default graphql(currentUserQuery)(Profile)
```

## Jest

[Jest](https://facebook.github.io/jest/) can't use the Webpack loaders. To make the same transformation work in Jest, use [jest-transform-graphql](https://github.com/remind101/jest-transform-graphql).

## FuseBox

[FuseBox](http://fuse-box.org) can't use the Webpack loaders. To make the same transformation work in FuseBox, use [fuse-box-graphql-plugin](https://github.com/otothea/fuse-box-graphql-plugin).

## React native

[React native](https://facebook.github.io/react-native/) can't use the Webpack loaders. To make the same transformation work in React native, use [babel-plugin-import-graphql](https://github.com/detrohutt/babel-plugin-import-graphql).

## Create-React-App

[react-app-rewire-inline-import-graphql-ast](https://github.com/detrohutt/react-app-rewire-inline-import-graphql-ast/) is available for users of [create-react-app](https://github.com/facebook/create-react-app/) that would like to use graphql files without needing to eject the app first.

## Fragments

You can use and include fragments in .graphql files and have webpack include those dependencies for you, similar to how you would use fragments and queries with the gql tag in plain JS.

```graphql
#import "./UserInfoFragment.graphql"

query CurrentUserForLayout {
  currentUser {
    ...UserInfo
  }
}
```

See how we import the UserInfo fragment from another .graphql file (same way you'd import modules in JS).

And here's an example of defining the fragment in another .graphql file.

```graphql
fragment UserInfo on User {
  login
  avatar_url
}
```

---

## title: Recompose patterns

[Recompose](https://github.com/acdlite/recompose) is a toolbelt for working with React components in a reusable, functional way. The workflow is similar to libraries like Underscore or Lodash, which can help you avoid re-implementing common patterns and keep your code [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). Check out the [Recompose API](https://github.com/acdlite/recompose/blob/master/docs/API.md) for all the details.

<h2 id="loading-status">Loading status</h2>

A common use-case when using the `graphql` HOC is to display a "loading" screen while your data is being fetched. We often end up with something like this:

```js
const Component = props => {
  if (props.data.loading) {
    return <LoadingPlaceholder>
  }

  return (
    <div>Our component</div>
  )
}
```

Recompose has a utility function `branch()` which lets us compose different HOCs based on the results of a test function. We can combine it with another Recompose method, `renderComponent()`. So we can say "If we are loading, render `LoadingPlaceholder` instead of our default component", like so:

```js
import { propType } from "graphql-anywhere";

const renderWhileLoading = (component, propName = "data") =>
  branch(
    props => props[propName] && props[propName].loading,
    renderComponent(component)
  );

const Component = props => <div>Our component for {props.user.name}</div>;
Component.propTypes = {
  // autogenerated proptypes should be in place (if no error)
  user: propType(getUser).isRequired
};

const enhancedComponent = compose(
  graphql(getUser, { name: "user" }),
  renderWhileLoading(LoadingPlaceholder, "user")
)(Component);

export default enhancedComponent;
```

This way, our wrapped component is only rendered outside of the loading state. That means we only need to take care of 2 states: error or successful load.

> Note: `loading` is only `true` during the first fetch for a particular query. But if you enable [options.notifyOnNetworkStatusChange](../basics/queries.html#graphql-config-options-notifyOnNetworkStatusChange) you can keep track of other loading status using the [data.networkStatus](../basics/queries.html#graphql-query-data-networkStatus) field. You can use a similar pattern to the above.

<h2 id="error-handling">Error handling</h2>

Similar to the loading state above, we might want to display a different component in the case of an error, or let the user `refetch()`. We will use `withProps()` to include the refetch method directly in the props. This way our universal error handler can always expect it to be there and is more decoupled.

```js
const renderForError = (component, propName = "data") =>
  branch(
    props => props[propName] && props[propName].error,
    renderComponent(component)
  );

const ErrorComponent = props => (
  <span>
    Something went wrong, you can try to
    <button onClick={props.refetch}>refetch</button>
  </span>
);

const setRefetchProp = (propName = "data") =>
  withProps(props => ({ refetch: props[propName] && props[propName].refetch }));

const enhancedComponent = compose(
  graphql(getUser, { name: "user" }),
  renderWhileLoading(LoadingPlaceholder, "user"),
  setRefetchProp("user"),
  renderForError(ErrorComponent, "user")
)(Component);

export default enhancedComponent;
```

Now we can count on results being available for our default component and don't have to manually check for loading state or errors inside the `render` function.

<h2 id="query-lifecycle">Query lifecycle</h2>

There are some use-cases when we need to execute code after a query finishes fetching. From the example above, we would render our default component only when there is no error and loading is finished.

But it is just a stateless component; it has no lifecycle hooks. If we need extra lifecycle functionality, Recompose's `lifecycle()` comes to the rescue:

```js
const execAtMount = lifecycle({
  componentWillMount() {
    executeSomething();
  }
});

const enhancedComponent = compose(
  graphql(getUser, { name: "user" }),
  renderWhileLoading(LoadingPlaceholder, "user"),
  setRefetchProp("user"),
  renderForError(ErrorComponent, "user"),
  execAtMount
)(Component);
```

The above works well if we just want something to happen at component mount time.

Let's define another more advanced use-case, for example, using `react-select` to let a user pick an option from the results of a query. I want to always display the react-select, which has its own loading state indicator. Then, I want to automatically select the predefined option after the query finishes fetching.

There is one caveat: we need to be aware that the query can skip the loading state when data is already in the cache. That would mean we need to handle `networkStatus === 7` on mount.

We will also use recompose's `withState()` to keep value for our option picker. For this example we will assume the default `data` prop name is unchanged.

```js
const DEFAULT_PICK = "orange";
const withPickerValue = withState("pickerValue", "setPickerValue", null);

// find matching option
const findOption = (options, ourLabel) =>
  lodashFind(
    options,
    option => option.label.toLowerCase() === ourLabel.toLowerCase()
  );

const withAutoPicking = lifecycle({
  componentWillReceiveProps(nextProps) {
    // when value was already picked
    if (nextProps.pickerValue) {
      return;
    }
    // networkStatus changed from 1 to 7, meaning initial load finished successfully
    if (
      this.props.data.networkStatus === 1 &&
      nextProps.data.networkStatus === 7
    ) {
      const match = findOption(nextProps.data.options);
      if (match) {
        nextProps.setPickerValue(match);
      }
    }
  },
  componentWillMount() {
    const { pickerValue, setPickerValue, data } = this.props;
    if (pickerValue) {
      return;
    }
    // when Apollo query is resolved from cache,
    // it already has networkStatus 7 at mount time
    if (data.networkStatus === 7 && !data.error) {
      const match = findOption(data.options);
      if (match) {
        setPickerValue(match);
      }
    }
  }
});

const Component = props => (
  <Select
    loading={props.data.loading}
    value={(props.pickerValue && props.pickerValue.value) || null}
    onChange={props.setPickerValue}
    options={props.data.options || undefined}
  />
);

const enhancedComponent = compose(
  graphql(getOptions),
  withPickerValue,
  withAutoPicking
)(Component);
```

<h2 id="controlling-poll-interval">Controlling pollInterval</h2>

This case is borrowed from [David Glasser's post on the Apollo blog](https://blog.apollographql.com/dynamic-graphql-polling-with-react-and-apollo-client-fb36e390d250) about the Meteor's Galaxy UI migrations panel implementation. In the post, he says:

> We’re not usually running any migrations, so a nice, slow polling interval like 30 seconds seemed reasonable. But in the rare case where a migration is running, I wanted to be able to see much faster updates on its progress.

> The key to this is knowing that the `options` parameter to react-apollo’s main graphql function can itself be a function that depends on its incoming React props. (The `options` parameter describes the options for the query itself, as opposed to React-specific details like what property name to use for data.) We can then use recompose's `withState()` to set the poll interval from a prop passed in to the graphql component, and use the `componentWillReceiveProps` React lifecycle event (added via the recompose lifecycle helper) to look at the fetched GraphQL data and adjust if necessary.

Let's look at the code:

```js
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { compose, withState, lifecycle } from "recompose";

const DEFAULT_INTERVAL = 30 * 1000;
const ACTIVE_INTERVAL = 500;

const withData = compose(
  // Pass down two props to the nested component: `pollInterval`,
  // which defaults to our normal slow poll, and `setPollInterval`,
  // which lets the nested components modify `pollInterval`.
  withState("pollInterval", "setPollInterval", DEFAULT_INTERVAL),
  graphql(
    gql`
      query GetMigrationStatus {
        activeMigration {
          name
          version
          progress
        }
      }
    `,
    {
      // If you think it's clear enough, you can abbreviate this as:
      //   options: ({pollInterval}) => ({pollInterval}),
      options: props => {
        return {
          pollInterval: props.pollInterval
        };
      }
    }
  ),
  lifecycle({
    componentWillReceiveProps({
      data: { loading, activeMigration },
      pollInterval,
      setPollInterval
    }) {
      if (loading) {
        return;
      }
      if (activeMigration && pollInterval !== ACTIVE_INTERVAL) {
        setPollInterval(ACTIVE_INTERVAL);
      } else if (!activeMigration && pollInterval !== DEFAULT_INTERVAL) {
        setPollInterval(DEFAULT_INTERVAL);
      }
    }
  })
);
const MigrationPanelWithData = withData(MigrationPanel);
```

Note that we check the current value of `pollInterval` before changing it because, by default in React, nested components will get re-rendered any time we change state, even if you change it to the same value. You can deal with this using `shouldComponentUpdate` or `React.PureComponent`, but in this case it’s straightforward just to only set the state when it’s actually changing.

<h2 id="other">Other use-cases</h2>

Recompose is a powerful tool and can be applied to all sorts of other cases. Here are a few final examples.

Normally, if you wanted to add side effects to the `mutate` function, you would manage them in the `graphql` HOC's [`props` option](https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-config-props) by doing something like `{ mutate: () => mutate().then(sideEffectHandler) }`. But that's not very reusable. Using recompose's `withHandlers()` you can compose the same prop manipulation in any number of components. You can see a more detailed example [here](https://medium.com/front-end-developers/how-i-write-mutations-in-apollo-w-recompose-1c0ab06ef4ea).

Mutations can also be tracked using recompose's `withState`, since it has no effect on your query's `loading` state. For example, you could use it to disable buttons while submitting form data.

See the full Recompose docs [here](https://github.com/acdlite/recompose).

import EventList from "@/components/landing/EventList";
import Header from "@/components/landing/Header";
import Loading from "@/components/landing/Loading";
import { Suspense } from "react";

const Home = ({ searchParams: { query } }) => {
  return (
    <section className="container">
      <Header />
      <Suspense key={query} fallback={<Loading />}>
        <EventList query={query} />
      </Suspense>
    </section>
  );
};

export default Home;

import EventList from "@/components/landing/EventList";
import Header from "@/components/landing/Header";

const Home = ({ searchParams: { query } }) => {
  return (
    <section className="container">
      <Header />
      <EventList query={query} />
    </section>
  );
};

export default Home;

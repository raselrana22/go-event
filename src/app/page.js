import EventList from "@/components/landing/EventList";
import Header from "@/components/landing/Header";

const Home = () => {
  return (
    <section className="container">
      <Header />
      <EventList />
    </section>
  );
};

export default Home;
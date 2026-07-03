import Hero from "../components/Hero";
import WhyChooseUs from "../components/WhyChooseUs";
import CustomerReviews from "../components/CustomerReviews";
import FAQ from "../components/FAQ";
import Pricing from "../components/Pricing";
import OrderForm from "../components/OrderForm";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import Navbar from "../components/Navbar";

function HomePage() {
  return (
    <div>
      <SEO />
      <Navbar />
      <Hero />
      <WhyChooseUs />
      <CustomerReviews />
      <FAQ />
      <Pricing />
      <OrderForm />
      <Footer />
    </div>
  );
}

export default HomePage;

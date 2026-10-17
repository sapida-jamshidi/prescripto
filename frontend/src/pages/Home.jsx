
import Header from "../components/Header";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";
import Banner from "../components/Banner";

function Home() {
  return (
    <main className="px-4 md:px-8">
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    </main>
  );
}
export default Home;

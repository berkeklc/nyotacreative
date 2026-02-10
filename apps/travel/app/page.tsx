import HomePageClient from "../components/HomePageClient";
import { getHomePageData } from "../lib/homepage";

export default async function Home() {
    const data = await getHomePageData();
    return <HomePageClient initialData={data} />;
}

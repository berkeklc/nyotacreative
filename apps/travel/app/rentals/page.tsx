import RentalsPageClient from "../../components/RentalsPageClient";
import { getRentalsData } from "../../lib/rentals";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RentalsPage() {
    const { transfers, vehicles } = await getRentalsData();
    return <RentalsPageClient transfers={transfers} vehicles={vehicles} />;
}

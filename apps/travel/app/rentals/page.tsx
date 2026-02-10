import RentalsPageClient from "../../components/RentalsPageClient";
import { getRentalsData } from "../../lib/rentals";

export default async function RentalsPage() {
    const { transfers, vehicles } = await getRentalsData();
    return <RentalsPageClient transfers={transfers} vehicles={vehicles} />;
}

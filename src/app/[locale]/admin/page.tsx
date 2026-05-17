import CreateQuestForm from "@/components/forms/CreateQuestForm/CreateQuestForm";
import OrdersTable from "@/components/admin/OrdersTable";
import QuestsTable from "@/components/admin/QuestsTable";
import { getOrders } from "@/actions/getOrders";
import { getQuests } from "@/actions/getQuests";

export default async function AdminPage() {
  const orders = await getOrders();
  const quests = await getQuests();

  return (
    <section className="container mx-auto py-[120px] px-12">
      <div className="space-y-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">Admin Panel</h1>
          <p className="text-sm text-gray-600">Тут можна додавати квести, редагувати їх і переглядати заявки.</p>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_560px] gap-12">
          <div className="space-y-8">
            <CreateQuestForm />
            <QuestsTable quests={quests} />
          </div>
          <OrdersTable orders={orders} />
        </div>
      </div>
    </section>
  );
}

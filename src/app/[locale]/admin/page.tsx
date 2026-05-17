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
          <p className="text-sm text-gray-600">Тут ви можете переглядати замовлення, керувати квестами та додавати нові.</p>
        </div>

        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Замовлення</h2>
            <OrdersTable orders={orders} />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Існуючі квести</h2>
            <QuestsTable quests={quests} />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Додати новий квест</h2>
            <CreateQuestForm />
          </div>
        </div>
      </div>
    </section>
  );
}

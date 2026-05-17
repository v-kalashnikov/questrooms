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
          <h1 className="text-4xl font-bold mb-4">Панель адміністратора</h1>
          <p className="text-sm text-textWhite">Тут можна переглядати замовлення, керувати квестами та додавати нові.</p>
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
            <details className="rounded-xl border border-[rgb(72_0_66)] bg-formsBackground shadow-sm">
              <summary className="cursor-pointer px-5 py-4 text-base font-medium text-textWhite outline-none transition hover:bg-opacity-75">
                Розгорнути форму додавання
              </summary>
              <div className="border-t border-[rgb(72_0_66)] px-5 py-6">
                <CreateQuestForm />
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}

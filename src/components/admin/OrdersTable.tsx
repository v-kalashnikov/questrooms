"use client";

import { useMemo, useState } from "react";

type OrderRow = {
  id: number;
  name: string;
  peopleCount: number;
  phone: string;
  isLegal: boolean;
  scheduledAt: string;
  status: string;
};

type OrdersTableProps = {
  orders: OrderRow[];
};

export default function OrdersTable({ orders }: OrdersTableProps) {
  const [orderList, setOrderList] = useState<OrderRow[]>(orders);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedOrder, setEditedOrder] = useState<{
    name: string;
    phone: string;
    peopleCount: number;
    scheduledAt: string;
    isLegal: boolean;
    status: string;
  } | null>(null);

  const currentOrder = useMemo(
    () => orderList.find((order) => order.id === editingId) ?? null,
    [editingId, orderList]
  );

  const startEditing = (order: OrderRow) => {
    setEditingId(order.id);
    setEditedOrder({
      name: order.name,
      phone: order.phone,
      peopleCount: order.peopleCount,
      scheduledAt: new Intl.DateTimeFormat('uk-UA', {
        dateStyle: 'short',
        timeStyle: 'short',
        }).format(new Date(order.scheduledAt)),
      isLegal: order.isLegal,
      status: order.status,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedOrder(null);
  };

  const saveOrder = async () => {
    if (!editedOrder || editingId === null) return;

    const res = await fetch(`/api/orders/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedOrder),
    });

    if (!res.ok) {
      console.error("Не вдалося оновити заявку");
      return;
    }

    const updated = await res.json();
    setOrderList((prev) =>
      prev.map((order) => (order.id === updated.id ? updated : order))
    );
    cancelEditing();
  };

  return (
    <div className="bg-formsBackground rounded-xl shadow-sm p-6 w-full border border-[rgb(72_0_66)]">
      <h2 className="text-2xl font-semibold mb-6 text-textWhite">Заявки</h2>
      {orderList.length === 0 ? (
        <p className="text-sm text-gray-400">Поки що немає заявок.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[rgb(72_0_66)]">
            <thead className="bg-opacity-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">
                  {"Ім'я"}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">
                  Телефон
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">
                  Кількість
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">
                  Дата/час
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">
                  Стан
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">
                  Дія
                </th>
              </tr>
            </thead>
            <tbody className="bg-formsBackground divide-y divide-[rgb(72_0_66)]">
              {orderList.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    {order.id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    {order.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    {order.phone}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    {order.peopleCount}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(order.scheduledAt).toLocaleString("uk-UA", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    <select
                      value={order.status}
                      onChange={async (event) => {
                        const newStatus = event.target.value;
                        const res = await fetch(`/api/orders/${order.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            name: order.name,
                            phone: order.phone,
                            peopleCount: order.peopleCount,
                            isLegal: order.isLegal,
                            status: newStatus,
                          }),
                        });
                        if (res.ok) {
                          setOrderList((prev) =>
                            prev.map((o) =>
                              o.id === order.id ? { ...o, status: newStatus } : o
                            )
                          );
                        }
                      }}
                      className="border border-[rgb(72_0_66)] rounded px-2 py-1 text-sm bg-formsBackground text-gray-300"
                    >
                      <option value="pending">Очікує</option>
                      <option value="confirmed">Підтверджено</option>
                      <option value="cancelled">Скасовано</option>
                    </select>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      type="button"
                      className="text-brandMagenta underline"
                      onClick={() => startEditing(order)}
                    >
                      Редагувати
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingId && editedOrder && (
        <div className="mt-6 border-t border-[rgb(72_0_66)] pt-6">
          <h3 className="text-xl font-semibold mb-4 text-textWhite">Редагувати заявку #{editingId}</h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">{"Ім'я"}</label>
              <input
                type="text"
                value={editedOrder.name}
                onChange={(event) =>
                  setEditedOrder({ ...editedOrder, name: event.target.value })
                }
                className="w-full border border-[rgb(72_0_66)] rounded px-4 py-3 bg-formsBackground text-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Телефон</label>
              <input
                type="tel"
                value={editedOrder.phone}
                onChange={(event) =>
                  setEditedOrder({ ...editedOrder, phone: event.target.value })
                }
                className="w-full border border-[rgb(72_0_66)] rounded px-4 py-3 bg-formsBackground text-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Кількість</label>
              <input
                type="number"
                min={1}
                value={editedOrder.peopleCount}
                onChange={(event) =>
                  setEditedOrder({
                    ...editedOrder,
                    peopleCount: Number(event.target.value),
                  })
                }
                className="w-full border border-[rgb(72_0_66)] rounded px-4 py-3 bg-formsBackground text-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Дата та час</label>
              <input
                type="datetime-local"
                value={editedOrder.scheduledAt}
                onChange={(event) =>
                  setEditedOrder({
                    ...editedOrder,
                    scheduledAt: event.target.value,
                  })
                }
                className="w-full border border-[rgb(72_0_66)] rounded px-4 py-3 bg-formsBackground text-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Стан</label>
              <select
                value={editedOrder.status}
                onChange={(event) =>
                  setEditedOrder({
                    ...editedOrder,
                    status: event.target.value,
                  })
                }
                className="w-full border border-[rgb(72_0_66)] rounded px-4 py-3 bg-formsBackground text-gray-300"
              >
                <option value="pending">Очікує</option>
                <option value="confirmed">Підтверджено</option>
                <option value="cancelled">Скасовано</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="rounded bg-brandMagenta px-5 py-3 text-white"
                onClick={saveOrder}
              >
                Зберегти
              </button>
              <button
                type="button"
                className="rounded border border-[rgb(72_0_66)] px-5 py-3 text-gray-300 hover:bg-opacity-50"
                onClick={cancelEditing}
              >
                Скасувати
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

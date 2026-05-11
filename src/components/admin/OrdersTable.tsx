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
    <div className="bg-white rounded-xl shadow-sm p-6 w-full">
      <h2 className="text-2xl font-semibold mb-6">Заявки</h2>
      {orderList.length === 0 ? (
        <p className="text-sm text-gray-600">Поки що немає заявок.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Ім'я
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Телефон
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Кількість
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Дата/час
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Стан
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Дія
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orderList.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.phone}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.peopleCount}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(order.scheduledAt).toLocaleString("uk-UA", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    <select
                      value={order.status}
                      onChange={async (event) => {
                        const newStatus = event.target.value;
                        const res = await fetch(`/api/orders/${order.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: newStatus }),
                        });
                        if (res.ok) {
                          setOrderList((prev) =>
                            prev.map((o) =>
                              o.id === order.id ? { ...o, status: newStatus } : o
                            )
                          );
                        }
                      }}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="pending">Очікує</option>
                      <option value="confirmed">Підтверджено</option>
                      <option value="cancelled">Скасовано</option>
                    </select>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    <button
                      type="button"
                      className="text-brandOrange underline"
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
        <div className="mt-6 border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Редагувати заявку #{editingId}</h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ім'я</label>
              <input
                type="text"
                value={editedOrder.name}
                onChange={(event) =>
                  setEditedOrder({ ...editedOrder, name: event.target.value })
                }
                className="w-full border rounded px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Телефон</label>
              <input
                type="tel"
                value={editedOrder.phone}
                onChange={(event) =>
                  setEditedOrder({ ...editedOrder, phone: event.target.value })
                }
                className="w-full border rounded px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Кількість</label>
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
                className="w-full border rounded px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Дата та час</label>
              <input
                type="datetime-local"
                value={editedOrder.scheduledAt}
                onChange={(event) =>
                  setEditedOrder({
                    ...editedOrder,
                    scheduledAt: event.target.value,
                  })
                }
                className="w-full border rounded px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Стан</label>
              <select
                value={editedOrder.status}
                onChange={(event) =>
                  setEditedOrder({
                    ...editedOrder,
                    status: event.target.value,
                  })
                }
                className="w-full border rounded px-4 py-3"
              >
                <option value="pending">Очікує</option>
                <option value="confirmed">Підтверджено</option>
                <option value="cancelled">Скасовано</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="rounded bg-brandOrange px-5 py-3 text-white"
                onClick={saveOrder}
              >
                Зберегти
              </button>
              <button
                type="button"
                className="rounded border border-gray-300 px-5 py-3"
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

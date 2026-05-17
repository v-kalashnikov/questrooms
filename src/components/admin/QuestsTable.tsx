"use client";

import { useMemo, useState } from "react";
import { Quest } from "@/types/Quest";
import { questImages } from "@/constants/questImages";

type QuestsTableProps = {
  quests: Quest[];
};

type EditableQuest = {
  title: string;
  description: string;
  previewImg: string;
  coverImg: string;
  type: string;
  level: string;
  peopleCount: string;
  duration: number;
};

function parsePeopleCount(value: string) {
  return value
    .split(",")
    .map((item) => parseInt(item.trim(), 10))
    .filter((item) => !Number.isNaN(item));
}

function extractImageName(image: string) {
  const match = image.match(/^(?:preview-|cover-)?(.+)\.jpg$/);
  return match ? match[1] : "";
}

export default function QuestsTable({ quests }: QuestsTableProps) {
  const [questList, setQuestList] = useState<Quest[]>(quests);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedQuest, setEditedQuest] = useState<EditableQuest | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");

  const currentQuest = useMemo(
    () => questList.find((quest) => quest.id === editingId) ?? null,
    [editingId, questList]
  );

  const availableImages = selectedType ? questImages[selectedType] || [] : [];

  const startEditing = (quest: Quest) => {
    setEditingId(quest.id);
    setSelectedType(quest.type);
    setSelectedImage(extractImageName(quest.previewImg));
    setEditedQuest({
      title: quest.title,
      description: quest.description,
      previewImg: quest.previewImg,
      coverImg: quest.coverImg,
      type: quest.type,
      level: quest.level,
      peopleCount: quest.peopleCount.join(","),
      duration: quest.duration,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedQuest(null);
    setSelectedType("");
    setSelectedImage("");
  };

  const saveQuest = async () => {
    if (!editedQuest || editingId === null) return;

    const payload = {
      ...editedQuest,
      type: selectedType || editedQuest.type,
      peopleCount: parsePeopleCount(editedQuest.peopleCount),
      duration: Number(editedQuest.duration),
    };

    const res = await fetch(`/api/quests/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Не вдалося оновити квест");
      return;
    }

    const updatedQuest = await res.json();
    setQuestList((prev) => prev.map((quest) => (quest.id === updatedQuest.id ? updatedQuest : quest)));
    cancelEditing();
  };

  const deleteQuest = async (id: number) => {
    const confirmed = window.confirm("Ви дійсно хочете видалити цей квест?");
    if (!confirmed) return;

    const res = await fetch(`/api/quests/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("Не вдалося видалити квест");
      return;
    }

    setQuestList((prev) => prev.filter((quest) => quest.id !== id));
    if (editingId === id) {
      cancelEditing();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 w-full">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Квести</h2>
      {questList.length === 0 ? (
        <p className="text-sm text-gray-600">Поки що немає квестів.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Назва</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Тип</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Рівень</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Люди</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Тривалість</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Дії</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {questList.map((quest) => (
                <tr key={quest.id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{quest.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{quest.title}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{quest.type}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{quest.level}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{quest.peopleCount.join(", ")}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{quest.duration} хв</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 space-x-3">
                    <button
                      type="button"
                      className="text-brandMagenta underline"
                      onClick={() => startEditing(quest)}
                    >
                      Редагувати
                    </button>
                    <button
                      type="button"
                      className="text-red-600 underline"
                      onClick={() => deleteQuest(quest.id)}
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingId && editedQuest && (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Редагувати квест #{editingId}</h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Назва</label>
              <input
                type="text"
                value={editedQuest.title}
                onChange={(event) =>
                  setEditedQuest({ ...editedQuest, title: event.target.value })
                }
                className="w-full border rounded px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Опис</label>
              <textarea
                value={editedQuest.description}
                onChange={(event) =>
                  setEditedQuest({ ...editedQuest, description: event.target.value })
                }
                className="w-full border rounded px-4 py-3 h-28"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Тип</label>
              <select
                value={selectedType}
                onChange={(event) => {
                  const newType = event.target.value;
                  setSelectedType(newType);
                  if (editedQuest) {
                    setEditedQuest({ ...editedQuest, type: newType });
                  }
                  if (!questImages[newType]?.includes(selectedImage)) {
                    setSelectedImage("");
                  }
                }}
                className="w-full border rounded px-4 py-3 bg-white"
              >
                <option value="">Оберіть тип</option>
                {Object.keys(questImages).map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Картинка</label>
              <select
                value={selectedImage}
                onChange={(event) => {
                  const newImage = event.target.value;
                  setSelectedImage(newImage);
                  if (editedQuest && newImage) {
                    setEditedQuest({
                      ...editedQuest,
                      previewImg: `preview-${newImage}.jpg`,
                      coverImg: `cover-${newImage}.jpg`,
                    });
                  }
                }}
                disabled={!selectedType}
                className="w-full border rounded px-4 py-3 bg-white"
              >
                <option value="">Оберіть картинку</option>
                {availableImages.map((image) => (
                  <option key={image} value={image}>
                    {image.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Рівень</label>
              <input
                type="text"
                value={editedQuest.level}
                onChange={(event) =>
                  setEditedQuest({ ...editedQuest, level: event.target.value })
                }
                className="w-full border rounded px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Кількість осіб</label>
              <input
                type="text"
                value={editedQuest.peopleCount}
                onChange={(event) =>
                  setEditedQuest({ ...editedQuest, peopleCount: event.target.value })
                }
                className="w-full border rounded px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Тривалість (хвилини)</label>
              <input
                type="number"
                min={1}
                value={editedQuest.duration}
                onChange={(event) =>
                  setEditedQuest({
                    ...editedQuest,
                    duration: Number(event.target.value),
                  })
                }
                className="w-full border rounded px-4 py-3"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="rounded bg-brandMagenta px-5 py-3 text-white"
                onClick={saveQuest}
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

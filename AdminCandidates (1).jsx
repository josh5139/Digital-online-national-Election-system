import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "./AdminLayout";
import API from "../api/api"; // Axios instance with JWT
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import Modal from "../component/Modal"; // ensure correct path

// Validation schema
const schema = yup.object({
  name: yup.string().trim().required("Name is required"),
  party: yup.string().trim().required("Party is required"),
  election: yup.string().trim().required("Election is required"),
});

export default function AdminCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const { register, handleSubmit, reset, formState } = useForm({
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await API.get("/candidates");
      setCandidates(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch candidates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const openAdd = () => {
    setEditing(null);
    reset();
    setModalOpen(true);
  };

  const openEdit = (candidate) => {
    setEditing(candidate);
    reset(candidate);
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await API.put(`/candidates/${editing.id}`, data);
        toast.success("Candidate updated successfully.");
      } else {
        await API.post("/candidates", data);
        toast.success("Candidate added successfully.");
      }
      setModalOpen(false);
      fetchCandidates();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Operation failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete candidate? This action cannot be undone.")) return;
    try {
      await API.delete(`/candidates/${id}`);
      toast.success("Candidate deleted successfully.");
      fetchCandidates();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete candidate.");
    }
  };

  // Search + pagination
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.party.toLowerCase().includes(q) ||
        c.election.toLowerCase().includes(q)
    );
  }, [candidates, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Manage Candidates</h1>
        <div className="flex gap-2 flex-wrap">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name/party/election..."
            className="border p-2 rounded w-80"
          />
          <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Candidate
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Party</th>
              <th className="p-3">Election</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-4 text-center">Loading...</td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center">No candidates found</td>
              </tr>
            ) : (
              paginated.map((c, i) => (
                <tr key={c.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">{(page - 1) * perPage + i + 1}</td>
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.party}</td>
                  <td className="p-3">{c.election}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)} className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500">Edit</button>
                      <button onClick={() => handleDelete(c.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
        <div className="text-sm text-gray-600">
          Showing {(page - 1) * perPage + 1} - {Math.min(page * perPage, filtered.length)} of {filtered.length}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded hover:bg-gray-100">Prev</button>
          <span>{page} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded hover:bg-gray-100">Next</button>
        </div>
      </div>

      {/* Modal: Add / Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); reset(); }}
        title={editing ? "Edit Candidate" : "Add Candidate"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {["name", "party", "election"].map((field) => (
            <div key={field}>
              <label className="block text-sm mb-1 capitalize">{field}</label>
              <input {...register(field)} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400" />
              <p className="text-red-500 text-sm mt-1">{errors[field]?.message}</p>
            </div>
          ))}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => { setModalOpen(false); reset(); }} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {editing ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}

import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "./AdminLayout";
import API from "../api/api"; // Your configured axios instance
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import Modal from "../component/Modal"; // make sure path is correct

// Validation Schema
const schema = yup.object({
  fullName: yup.string().trim().required("Full Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10,15}$/, "Invalid phone number"),
  nationalId: yup.mixed().required("National ID upload is required"),
  region: yup.string().required("Region is required"),
  age: yup.number().required("Age is required").min(18, "Voter must be 18 or older"),
});

export default function AdminVoters() {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const { register, handleSubmit, reset, formState } = useForm({
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  const fetchVoters = async () => {
    try {
      setLoading(true);
      const res = await API.get("/voters");
      setVoters(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch voters");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVoters(); }, []);

  const openAdd = () => {
    setEditing(null);
    reset();
    setModalOpen(true);
  };

  const openEdit = (v) => {
    setEditing(v);
    reset(v);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete voter? This cannot be undone.")) return;
    try {
      await API.delete(`/voters/${id}`);
      toast.success("Voter deleted");
      fetchVoters();
    } catch (err) {
      toast.error("Failed to delete voter");
      console.error(err);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("region", data.region);
      formData.append("age", data.age);
      formData.append("nationalId", data.nationalId[0]); // file

      if (editing) {
        await API.put(`/voters/${editing.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Voter updated");
      } else {
        await API.post("/voters", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Voter added");
      }
      setModalOpen(false);
      fetchVoters();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
      console.error(err);
    }
  };

  // Search + Pagination
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return voters.filter(
      (v) =>
        v.fullName.toLowerCase().includes(q) ||
        v.nationalId.toLowerCase().includes(q) ||
        v.region.toLowerCase().includes(q)
    );
  }, [voters, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages]);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Registered Voters</h1>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name/ID/region..."
            className="border p-2 rounded w-80"
          />
          <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Voter
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">#</th>
              <th className="text-left p-3">Full Name</th>
              <th className="text-left p-3">National ID</th>
              <th className="text-left p-3">Region</th>
              <th className="text-left p-3">Age</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="p-4 text-center">Loading...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan="6" className="p-4 text-center">No voters found</td></tr>
            ) : (
              paginated.map((v, i) => (
                <tr key={v.id} className="border-t">
                  <td className="p-3">{(page - 1) * perPage + i + 1}</td>
                  <td className="p-3">{v.fullName}</td>
                  <td className="p-3">{v.nationalId}</td>
                  <td className="p-3">{v.region}</td>
                  <td className="p-3">{v.age}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => openEdit(v)} className="px-2 py-1 bg-yellow-400 rounded">Edit</button>
                    <button onClick={() => handleDelete(v.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Showing {(page - 1) * perPage + 1} - {Math.min(page * perPage, filtered.length)} of {filtered.length}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded">Prev</button>
          <span>{page} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); reset(); }}
        title={editing ? "Edit Voter" : "Add Voter"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input {...register("fullName")} className="w-full border p-2 rounded" />
            <p className="text-red-500 text-sm">{errors.fullName?.message}</p>
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input {...register("email")} className="w-full border p-2 rounded" />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>

          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input {...register("phone")} className="w-full border p-2 rounded" />
            <p className="text-red-500 text-sm">{errors.phone?.message}</p>
          </div>

          <div>
            <label className="block text-sm mb-1">Region</label>
            <input {...register("region")} className="w-full border p-2 rounded" />
            <p className="text-red-500 text-sm">{errors.region?.message}</p>
          </div>

          <div>
            <label className="block text-sm mb-1">Age</label>
            <input type="number" {...register("age")} className="w-full border p-2 rounded" />
            <p className="text-red-500 text-sm">{errors.age?.message}</p>
          </div>

          <div>
            <label className="block text-sm mb-1">National ID Upload</label>
            <input type="file" {...register("nationalId")} accept=".pdf,.jpg,.jpeg,.png" className="w-full" />
            <p className="text-red-500 text-sm">{errors.nationalId?.message}</p>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => { setModalOpen(false); reset(); }} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editing ? "Update" : "Add"}</button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}

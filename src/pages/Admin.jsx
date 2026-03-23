import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import config from "../assets/siteConfig.json";
import { getAllBikesForAdmin, saveBikes } from "../utils/bikesStorage";

const PageWrapper = styled.div`
  margin: 0 auto;
  padding: 0;
`;

const AdminContent = styled.section`
  font-family: Arial, Helvetica, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
`;

const BikeForm = styled.form`
  background: #faf7f7;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }

  input,
  textarea {
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    font-family: Arial, Helvetica, sans-serif;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }

  small {
    display: block;
    margin-top: 0.25rem;
    color: #666;
    font-size: 0.85rem;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  background-color: #3A8BC5;
  border: none;
  color: #fff;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  font-family: Arial, Helvetica, sans-serif;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #2d6fa3;
  }

  &.secondary {
    background-color: #7a7979;

    &:hover {
      background-color: #5c5b5b;
    }
  }

  &.danger {
    background-color: #b90000;

    &:hover {
      background-color: #8f0000;
    }
  }
`;

const BikeList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const BikeListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 0.5rem;

  .bike-info {
    flex: 1;
  }

  .bike-name {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .bike-price {
    color: #3A8BC5;
    font-size: 0.95rem;
  }

  .bike-actions {
    display: flex;
    gap: 0.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  margin: 2rem 0 1rem;
`;

const EmptyBikes = styled.p`
  color: #666;
  font-style: italic;
  padding: 1rem 0;
`;

const LoginForm = styled.form`
  max-width: 320px;
  margin: 3rem auto;
  padding: 2rem;
  background: #faf7f7;
  border: 1px solid #e0e0e0;
  border-radius: 8px;

  label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }

  input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    font-family: Arial, Helvetica, sans-serif;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    margin-bottom: 1rem;
  }

  .error {
    color: #b90000;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
`;

const ADMIN_AUTH_KEY = 'basementbikemechanic_admin_auth';

const ImagePickerButton = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #3A8BC5;
  color: #fff;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  font-family: Arial, Helvetica, sans-serif;
  cursor: pointer;
  border-radius: 4px;
  border: none;

  &:hover {
    background-color: #2d6fa3;
  }

  input {
    display: none;
  }
`;

const ImagePreviews = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #ccc;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  button {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 24px;
    height: 24px;
    padding: 0;
    font-size: 16px;
    line-height: 1;
    background: rgba(0,0,0,0.6);
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #b90000;
    }
  }
`;

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Admin() {
  const navigate = useNavigate();
  const expectedPassword = process.env.REACT_APP_ADMIN_PASSWORD || '';
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    sessionStorage.getItem(ADMIN_AUTH_KEY) === '1'
  );
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [bikes, setBikes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", images: [], price: "" });
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    setBikes(getAllBikesForAdmin(config.bikes));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    if (!expectedPassword) {
      setLoginError('Admin access is not configured. Set REACT_APP_ADMIN_PASSWORD in your .env file.');
      return;
    }
    if (password === expectedPassword) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, '1');
      setIsAuthenticated(true);
    } else {
      setLoginError('Incorrect password.');
    }
  };

  if (!isAuthenticated) {
    return (
      <PageWrapper>
        <Header />
        <AdminContent>
          <PageTitle>Admin Login</PageTitle>
          <LoginForm onSubmit={handleLogin}>
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoComplete="current-password"
            />
            {loginError && <div className="error">{loginError}</div>}
            <Button type="submit">Log in</Button>
          </LoginForm>
        </AdminContent>
        <Footer onBack={() => navigate("/")} />
      </PageWrapper>
    );
  }

  const nextId = () => {
    const ids = bikes.map((b) => b.id);
    return ids.length ? Math.max(...ids) + 1 : 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setImageError("");
    if (!form.name.trim()) return;
    if (form.images.length === 0) {
      setImageError("Please add at least one image.");
      return;
    }

    const bike = {
      id: editingId !== null ? editingId : nextId(),
      name: form.name.trim(),
      images: [...form.images],
      price: parseInt(form.price, 10) || 0,
    };

    let updated;
    if (editingId !== null) {
      updated = bikes.map((b) => (b.id === editingId ? bike : b));
    } else {
      updated = [...bikes, bike];
    }

    try {
      saveBikes(updated);
      setBikes(updated);
      setForm({ name: "", images: [], price: "" });
      setEditingId(null);
    } catch (err) {
      setImageError("Storage limit reached. Try fewer or smaller images.");
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;

    setImageError("");
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length < files.length) {
      setImageError("Some files were skipped (not images).");
    }

    try {
      const dataUrls = await Promise.all(imageFiles.map(fileToDataUrl));
      setForm((f) => ({ ...f, images: [...f.images, ...dataUrls] }));
    } catch (err) {
      setImageError("Failed to read one or more images.");
    }
  };

  const removeImage = (index) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index),
    }));
  };

  const handleEdit = (bike) => {
    setForm({
      name: bike.name,
      images: [...(bike.images || [])],
      price: String(bike.price),
    });
    setEditingId(bike.id);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this bike listing?")) return;
    const updated = bikes.filter((b) => b.id !== id);
    setBikes(updated);
    saveBikes(updated);
    if (editingId === id) {
      setForm({ name: "", images: [], price: "" });
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setForm({ name: "", images: [], price: "" });
    setEditingId(null);
    setImageError("");
  };

  return (
    <PageWrapper>
      <Header />
      <AdminContent>
        <PageTitle>Admin – Bikes for Sale</PageTitle>
        <BikeForm onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="bike-name">Bike name</label>
            <input
              id="bike-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Trek Domane SL 6"
              required
            />
          </FormGroup>
          <FormGroup>
            <label>Images</label>
            <ImagePickerButton>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
              />
              Choose images…
            </ImagePickerButton>
            {form.images.length > 0 && (
              <ImagePreviews>
                {form.images.map((src, i) => (
                  <ImagePreview key={i}>
                    <img src={src} alt={`Preview ${i + 1}`} />
                    <button type="button" onClick={() => removeImage(i)} aria-label="Remove image">
                      ×
                    </button>
                  </ImagePreview>
                ))}
              </ImagePreviews>
            )}
            {imageError && <small style={{ color: "#b90000" }}>{imageError}</small>}
            <small>Select multiple images from your computer. Keep file sizes reasonable to avoid storage limits.</small>
          </FormGroup>
          <FormGroup>
            <label htmlFor="bike-price">Price ($)</label>
            <input
              id="bike-price"
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              placeholder="300"
            />
          </FormGroup>
          <ButtonRow>
            <Button type="submit">{editingId !== null ? "Update" : "Add"} bike</Button>
            {editingId !== null && (
              <Button type="button" className="secondary" onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}
          </ButtonRow>
        </BikeForm>

        <SectionTitle>Current listings</SectionTitle>
        {bikes.length === 0 ? (
          <EmptyBikes>No bikes listed yet. Add one above.</EmptyBikes>
        ) : (
          <BikeList>
            {bikes.map((bike) => (
              <BikeListItem key={bike.id}>
                <div className="bike-info">
                  <div className="bike-name">{bike.name || '(Untitled)'}</div>
                  <div className="bike-price">${bike.price} · {bike.images.length} image(s)</div>
                </div>
                <div className="bike-actions">
                  <Button type="button" className="secondary" onClick={() => handleEdit(bike)}>
                    Edit
                  </Button>
                  <Button type="button" className="danger" onClick={() => handleDelete(bike.id)}>
                    Delete
                  </Button>
                </div>
              </BikeListItem>
            ))}
          </BikeList>
        )}
      </AdminContent>
      <Footer onBack={() => navigate("/")} />
    </PageWrapper>
  );
}

export default Admin;

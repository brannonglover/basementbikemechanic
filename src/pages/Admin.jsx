import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageSeo from "../components/PageSeo";
import config from "../assets/siteConfig.json";
import { getAllBikesForAdmin, saveBikes } from "../utils/bikesStorage";

const PageWrapper = styled.div`
  margin: 0 auto;
  padding: 0;
`;

const AdminContent = styled.section`
  max-width: ${({ theme }) => theme.maxWidth.prose};
  margin: 0 auto;
  padding: 2rem 1.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const PageTitle = styled.h1`
  font-size: clamp(1.5rem, 2.5vw, 1.85rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 1.5rem;
`;

const BikeForm = styled.form`
  background: ${({ theme }) => theme.colors.bgMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: ${({ theme }) => theme.shadow.sm};
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
    padding: 0.55rem 0.75rem;
    font-size: 1rem;
    font-family: inherit;
    border: 1px solid ${({ theme }) => theme.colors.borderStrong};
    border-radius: ${({ theme }) => theme.radius.sm};
    box-sizing: border-box;
    background: ${({ theme }) => theme.colors.surface};
    transition: border-color ${({ theme }) => theme.transition};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }

  small {
    display: block;
    margin-top: 0.25rem;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.85rem;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  color: #fff;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: background ${({ theme }) => theme.transition};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &.secondary {
    background-color: ${({ theme }) => theme.colors.textMuted};

    &:hover {
      background-color: ${({ theme }) => theme.colors.text};
    }
  }

  &.danger {
    background-color: #b42318;

    &:hover {
      background-color: #8a1c12;
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
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  margin-bottom: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadow.sm};

  .bike-info {
    flex: 1;
  }

  .bike-name {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .bike-price {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 0.95rem;
  }

  .bike-actions {
    display: flex;
    gap: 0.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 2rem 0 1rem;
`;

const EmptyBikes = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  padding: 1rem 0;
`;

const LoginForm = styled.form`
  max-width: 320px;
  margin: 3rem auto;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.bgMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.md};

  label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }

  input {
    width: 100%;
    padding: 0.55rem 0.75rem;
    font-size: 1rem;
    font-family: inherit;
    border: 1px solid ${({ theme }) => theme.colors.borderStrong};
    border-radius: ${({ theme }) => theme.radius.sm};
    box-sizing: border-box;
    margin-bottom: 1rem;
    background: ${({ theme }) => theme.colors.surface};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }

  .error {
    color: #b42318;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
`;

const ADMIN_AUTH_KEY = 'basementbikemechanic_admin_auth';

const DropZone = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  min-height: 120px;
  padding: 1.5rem;
  box-sizing: border-box;
  border: 2px dashed ${({ theme, $dragging }) => $dragging ? theme.colors.primary : theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $dragging }) => $dragging ? theme.colors.accentMuted : theme.colors.surface};
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transition}, background ${({ theme }) => theme.transition};
  text-align: center;
  font-size: 0.95rem;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.accentMuted};
  }

  .drop-icon {
    font-size: 2rem;
    line-height: 1;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  strong {
    color: ${({ theme }) => theme.colors.primary};
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
  border-radius: ${({ theme }) => theme.radius.sm};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};

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
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    border: none;
    border-radius: ${({ theme }) => theme.radius.sm};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #8a1c12;
    }
  }
`;

const MAX_PX = 1200;
const JPEG_QUALITY = 0.78;

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_PX || height > MAX_PX) {
          if (width >= height) {
            height = Math.round((height * MAX_PX) / width);
            width = MAX_PX;
          } else {
            width = Math.round((width * MAX_PX) / height);
            height = MAX_PX;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      img.src = e.target.result;
    };
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
  const [isDragging, setIsDragging] = useState(false);

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
        <PageSeo
          title="Admin | Basement Bike Mechanic"
          description="Staff login for Basement Bike Mechanic."
          path="/admin"
          noindex
        />
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

  const processFiles = async (files) => {
    if (files.length === 0) return;
    setImageError("");
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length < files.length) {
      setImageError("Some files were skipped (not images).");
    }
    try {
      const dataUrls = await Promise.all(imageFiles.map(compressImage));
      setForm((f) => ({ ...f, images: [...f.images, ...dataUrls] }));
    } catch (err) {
      setImageError("Failed to read one or more images.");
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    await processFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    await processFiles(files);
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
      <PageSeo
        title="Admin – Bikes for Sale | Basement Bike Mechanic"
        description="Manage used bike listings for Basement Bike Mechanic."
        path="/admin"
        noindex
      />
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
            <DropZone
              $dragging={isDragging}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
              />
              <span className="drop-icon">📷</span>
              <span>
                <strong>Click to browse</strong> or drag &amp; drop images here
              </span>
              <span style={{ fontSize: "0.8rem" }}>Keep file sizes reasonable to avoid storage limits.</span>
            </DropZone>
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

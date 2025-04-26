import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";

const API_URL = "https://localhost:7148/api/auth"; // Thay bằng URL thực tế của bạn

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        setError("Không thể tải thông tin người dùng.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-primary text-white">Thông Tin Cá Nhân</Card.Header>
            <Card.Body>
              <p><strong>Họ Tên:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Số Điện Thoại:</strong> {user.phone}</p>
              <p><strong>Địa Chỉ:</strong> {user.address}</p>
              <p><strong>Vai Trò:</strong> {user.role}</p>
              <p><strong>Ngày Tạo:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
              <p><strong>Cập Nhật Gần Nhất:</strong> {new Date(user.updatedAt).toLocaleDateString()}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;

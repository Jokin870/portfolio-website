.form-group {
  margin-bottom: 15px;
}

.custom-popup {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #222;
  color: #fff;
  padding: 12px 20px;
  border-radius: 8px;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  font-family: inherit;
  z-index: 9999;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.custom-popup.show {
  opacity: 1;
  transform: translateY(0);
}

.form-results {
  margin-top: 20px;
  line-height: 1.6;
  font-family: inherit;
  padding-top: 10px;
}

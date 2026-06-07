// ==========================================
// Mock Database Layer
// ==========================================

const DEFAULT_SHELTERS_DB = [];

const DEFAULT_PLEDGES_QUEUE = [];

let SHELTERS_DB = [];
let PLEDGES_QUEUE = [];

const DB_VERSION = "v5";

function initDatabase() {
  // Always load from defaults to reset on page reload/refresh
  SHELTERS_DB = JSON.parse(JSON.stringify(DEFAULT_SHELTERS_DB));
  PLEDGES_QUEUE = JSON.parse(JSON.stringify(DEFAULT_PLEDGES_QUEUE));
}

function saveDatabase() {
  // Do not persist to localStorage so that refresh resets state
}

function getWeightOrVolume(need) {
  if (need.weightOrVolume) return need.weightOrVolume;
  const name = need.name;
  const match = name.match(/(\d+(?:\.\d+)?\s*(?:kg|l|ml|g|pcs|pack|combo|board))/i);
  if (match) {
    return match[1];
  }
  if (name.toLowerCase().includes("atta")) return "10kg";
  if (name.toLowerCase().includes("milk") || name.toLowerCase().includes("oil")) return "1L";
  if (name.toLowerCase().includes("dal") || name.toLowerCase().includes("rice")) return "1kg";
  if (name.toLowerCase().includes("meal") || name.toLowerCase().includes("combo")) return "1 Combo";
  return "1 Unit";
}

// Initialize on execution
initDatabase();

// ==========================================
// UI / State Variables
// ==========================================

let activeView = "donor"; // donor | admin
let selectedShelter = SHELTERS_DB.length > 0 ? SHELTERS_DB[0] : null;
let activeCheckoutNeed = null;
let currentTrackingOrder = null;
let activeCauseFilter = "all";
let activeDetailsOrderId = null;
let currentWorkflowLogs = null;

// ==========================================
// Swiggy MCP Logger Engine
// ==========================================

function logToConsole(type, label, data) {
  const consoleOutput = document.getElementById("mcp-terminal-console");
  
  if (currentWorkflowLogs) {
    currentWorkflowLogs.push({
      time: new Date().toLocaleTimeString(),
      type: type,
      label: label,
      data: data ? JSON.parse(JSON.stringify(data)) : null
    });
  }

  if (!consoleOutput) return;

  const entry = document.createElement("div");
  entry.className = `console-log-entry ${type}`;
  
  const time = new Date().toLocaleTimeString();
  const timeSpan = document.createElement("span");
  timeSpan.className = "console-timestamp";
  timeSpan.innerText = `[${time}]`;
  entry.appendChild(timeSpan);
  
  const labelSpan = document.createElement("span");
  if (type === "rpc-req") {
    labelSpan.className = "console-label req";
    labelSpan.innerText = `--> JSON-RPC Request (${label})`;
  } else if (type === "rpc-res") {
    labelSpan.className = "console-label res";
    labelSpan.innerText = `<-- JSON-RPC Response (${label})`;
  } else {
    labelSpan.className = "console-label info";
    labelSpan.innerText = `[SYSTEM INFO] ${label}`;
  }
  entry.appendChild(labelSpan);

  if (data) {
    const pre = document.createElement("pre");
    pre.className = "console-json";
    pre.innerText = JSON.stringify(data, null, 2);
    entry.appendChild(pre);
  }

  consoleOutput.appendChild(entry);
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function clearConsole() {
  const consoleOutput = document.getElementById("mcp-terminal-console");
  if (consoleOutput) {
    consoleOutput.innerHTML = `<div class="log-line">--- Swiggy Model Context Protocol (MCP) Terminal Connected ---</div>`;
  }
  logToConsole("info", "Swiggy MCP Console Ready. Initiating session...", null);
}

// ==========================================
// Swiggy MCP Tool Invocation Simulations
// ==========================================

async function simulateMcpCall(server, toolName, args) {
  const requestId = Math.floor(Math.random() * 1000000);
  
  // Emitters
  logToConsole("rpc-req", `${server}/${toolName}`, {
    jsonrpc: "2.0",
    id: requestId,
    method: `tools/call`,
    params: {
      name: toolName,
      arguments: args
    }
  });

  // Short delay to simulate API network trip
  await new Promise(resolve => setTimeout(resolve, 800));

  let responseData = {};
  
  // Instamart Tool Routes
  if (server === "instamart") {
    switch (toolName) {
      case "get_addresses":
        responseData = {
          success: true,
          addresses: [
            { id: "addr_aasha_99", label: "Aasha Shelter", displayText: "Aasha Senior Citizen Home, Varanasi, UP - 221005" },
            { id: "addr_kalyan_88", label: "Kalyan Shelter", displayText: "Kalyan Children's Orphanage, Koramangala, Bengaluru - 560034" },
            { id: "addr_paws_77", label: "Paws Shelter", displayText: "Paws & Claws Animal Rescue, Marol, Mumbai - 400059" }
          ]
        };
        break;
      case "search_products":
        responseData = {
          success: true,
          products: [
            {
              name: args.query,
              id: "prod_search_id",
              variants: [
                { spinId: args.spinId || `sku_searched_${Math.floor(Math.random()*1000)}`, price: 250, size: "Pack of 1" }
              ]
            }
          ]
        };
        break;
      case "update_cart":
        responseData = {
          success: true,
          cartSize: args.items.reduce((acc, curr) => acc + curr.quantity, 0),
          items: args.items
        };
        break;
      case "get_cart":
        const subtotal = args.price * args.quantity;
        const delFee = 39;
        const tax = Math.round(subtotal * 0.05);
        responseData = {
          success: true,
          items: [{ spinId: args.spinId, quantity: args.quantity, price: args.price }],
          billBreakdown: {
            subtotal: subtotal,
            deliveryFee: delFee,
            taxes: tax,
            total: subtotal + delFee + tax
          }
        };
        break;
      case "checkout":
        responseData = {
          success: true,
          orderId: `sw_order_gro_${Math.floor(Math.random()*9000 + 1000)}`,
          paymentMethod: args.paymentMethod,
          status: "PLACED",
          etaMinutes: 15
        };
        break;
      case "track_order":
        responseData = {
          success: true,
          orderId: args.orderId,
          status: "IN_TRANSIT",
          deliveryPartner: { name: "Sunil Kumar", phone: "+91 98765 43210" },
          etaMinutes: args.etaRemaining || 12
        };
        break;
    }
  } 
  
  // Swiggy Food Tool Routes
  else if (server === "food") {
    switch (toolName) {
      case "get_addresses":
        responseData = {
          success: true,
          addresses: [
            { id: "addr_aasha_99", label: "Aasha Shelter", displayText: "Aasha Senior Citizen Home, Varanasi, UP - 221005" },
            { id: "addr_kalyan_88", label: "Kalyan Shelter", displayText: "Kalyan Children's Orphanage, Koramangala, Bengaluru - 560034" }
          ]
        };
        break;
      case "search_restaurants":
        responseData = {
          success: true,
          restaurants: [
            { id: args.restaurantId, name: args.restaurantId === "rest_bikanervala" ? "Bikanervala Sweets" : "Haldiram's Restaurant", availabilityStatus: "OPEN" }
          ]
        };
        break;
      case "get_restaurant_menu":
        responseData = {
          success: true,
          restaurantId: args.restaurantId,
          items: [
            { id: "food_item_01", name: args.dishName || "Special Treat", price: args.price }
          ]
        };
        break;
      case "update_food_cart":
        responseData = {
          success: true,
          restaurantId: args.restaurantId,
          items: [{ itemId: "food_item_01", quantity: args.quantity }]
        };
        break;
      case "get_food_cart":
        const foodSubtotal = args.price * args.quantity;
        responseData = {
          success: true,
          restaurantId: args.restaurantId,
          total: foodSubtotal + 45 + Math.round(foodSubtotal * 0.05),
          items: [{ itemId: "food_item_01", quantity: args.quantity, price: args.price }]
        };
        break;
      case "place_food_order":
        responseData = {
          success: true,
          orderId: `sw_order_food_${Math.floor(Math.random()*9000 + 1000)}`,
          status: "PLACED",
          etaMinutes: 35
        };
        break;
      case "track_food_order":
        responseData = {
          success: true,
          orderId: args.orderId,
          status: "IN_TRANSIT",
          deliveryPartner: { name: "Ramesh Singh", phone: "+91 99999 88888" },
          etaMinutes: args.etaRemaining || 25
        };
        break;
    }
  }

  logToConsole("rpc-res", `${server}/${toolName}`, {
    jsonrpc: "2.0",
    id: requestId,
    result: responseData
  });

  return responseData;
}

// ==========================================
// CORE WORKFLOW: Swiggy MCP Transaction Pipeline
// ==========================================

async function triggerSwiggyMcpOrderWorkflow(need, quantity, donorName) {
  currentWorkflowLogs = [];
  const isFood = need.type === "food";
  const server = isFood ? "food" : "instamart";
  const shelter = SHELTERS_DB.find(s => s.needs.some(n => n.id === need.id));
  
  logToConsole("info", `CRITICAL WORKFLOW: Starting automated ${isFood ? 'Swiggy Food' : 'Instamart Grocery'} procurement for ${shelter.name}...`, null);

  // 1. Resolve Delivery Address
  const addressesRes = await simulateMcpCall(server, "get_addresses", {});
  const resolvedAddress = addressesRes.addresses.find(a => a.id === shelter.swiggyAddressId);
  
  logToConsole("info", `Verified target shelter address locked: ID: ${resolvedAddress.id} | Display: "${resolvedAddress.displayText}"`, null);

  let orderConfirmation = null;

  if (!isFood) {
    // 2. Instamart Flow: Find product SKU
    const productSearchRes = await simulateMcpCall("instamart", "search_products", {
      addressId: resolvedAddress.id,
      query: need.name,
      spinId: need.spinId
    });
    const spinId = productSearchRes.products[0].variants[0].spinId;

    // 3. Update Cart
    await simulateMcpCall("instamart", "update_cart", {
      items: [{ spinId: spinId, quantity: quantity }]
    });

    // 4. Review Cart
    await simulateMcpCall("instamart", "get_cart", {
      spinId: spinId,
      quantity: quantity,
      price: need.price
    });

    // 5. Checkout (COD)
    orderConfirmation = await simulateMcpCall("instamart", "checkout", {
      paymentMethod: "COD"
    });

  } else {
    // 2. Food Flow: Search Restaurant
    const restSearchRes = await simulateMcpCall("food", "search_restaurants", {
      addressId: resolvedAddress.id,
      query: need.favoriteFood,
      restaurantId: need.restaurantId
    });
    const restaurantId = restSearchRes.restaurants[0].id;

    // 3. Get Menu
    await simulateMcpCall("food", "get_restaurant_menu", {
      restaurantId: restaurantId,
      dishName: need.name,
      price: need.price
    });

    // 4. Update Food Cart
    await simulateMcpCall("food", "update_food_cart", {
      restaurantId: restaurantId,
      quantity: quantity
    });

    // 5. Get Food Cart
    await simulateMcpCall("food", "get_food_cart", {
      restaurantId: restaurantId,
      quantity: quantity,
      price: need.price
    });

    // 6. Place Food Order
    orderConfirmation = await simulateMcpCall("food", "place_food_order", {
      paymentMethod: "COD"
    });
  }

  logToConsole("info", `SUCCESS! Swiggy Order placed successfully. Order ID: ${orderConfirmation.orderId}. Handing over tracking to Admin Dashboard.`, null);

  // 6. Add placed order to active system queue
  const newOrder = {
    id: `ord_${Math.floor(Math.random()*900 + 100)}`,
    shelterId: shelter.id,
    donorName: donorName,
    itemName: need.name,
    category: need.category,
    quantity: quantity,
    unitsToSupply: quantity,
    amount: need.price * quantity,
    swiggyOrderId: orderConfirmation.orderId,
    status: "placed",
    type: need.type,
    deliveryProgress: 15,
    eta: orderConfirmation.etaMinutes,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    mcpAuditTrail: currentWorkflowLogs
  };

  currentWorkflowLogs = null;

  PLEDGES_QUEUE.unshift(newOrder);

  // Update original needs tally (mock update database)
  need.pledged += quantity;
  need.delivered += quantity;
  saveDatabase();

  // Refresh UI dashboards
  renderShelters();
  renderDonationHistory();
  renderAdminPanel();

  // Run live mapping tracker simulation for this order
  runDeliverySimulation(newOrder);

  return newOrder;
}

// ==========================================
// Delivery Simulation Engine
// ==========================================

function runDeliverySimulation(order) {
  logToConsole("info", `Initiating delivery partner dispatch tracker for Swiggy Order: ${order.swiggyOrderId}...`, null);
  
  let progress = 15;
  const server = order.type;
  
  const timerId = setInterval(async () => {
    progress += 15;
    order.deliveryProgress = progress;

    // Trigger mock tracking API requests to Swiggy MCP
    const trackTool = server === "food" ? "track_food_order" : "track_order";
    const tracking = await simulateMcpCall(server, trackTool, {
      orderId: order.swiggyOrderId,
      etaRemaining: Math.max(2, Math.ceil((100 - progress) / 6))
    });

    if (progress >= 100) {
      clearInterval(timerId);
      if (window.deliveryTimers) {
        delete window.deliveryTimers[order.id];
      }
      order.status = "delivered";
      order.deliveryProgress = 100;
      
      saveDatabase();
      
      logToConsole("info", `DELIVERED! Swiggy partner completed drop-off at shelter doorstep. Order ID: ${order.swiggyOrderId}`, null);
      renderShelters();
      renderDonationHistory();
      renderAdminPanel();
    } else {
      order.status = "in_transit";
      renderDonationHistory();
      renderAdminPanel();
    }

    // Re-render modal if open
    if (activeDetailsOrderId === order.id) {
      openDonationDetailsModal(order.id);
    }
  }, 10000); // Progress updates every 10 seconds

  window.deliveryTimers = window.deliveryTimers || {};
  window.deliveryTimers[order.id] = timerId;
}

// ==========================================
// Rendering Engine - Donor View
// ==========================================

function renderShelters() {
  const grid = document.getElementById("shelter-grid");
  if (!grid) return;

  const filteredShelters = activeCauseFilter === "all"
    ? SHELTERS_DB
    : SHELTERS_DB.filter(s => s.cause_type === activeCauseFilter);

  grid.innerHTML = filteredShelters.map(shelter => {
    // Count active needs
    const unmetCount = shelter.needs.filter(n => n.pledged < n.quantity).length;
    const tagHtml = shelter.needs.slice(0, 3).map(n => {
      const isUrgent = (n.pledged / n.quantity) < 0.2;
      return `<span class="need-tag ${isUrgent ? 'urgent' : ''}">${n.name.split(' ')[0]}</span>`;
    }).join('');

    return `
      <div class="shelter-card">
        <div class="shelter-banner" style="background-image: url('${shelter.cover}')">
          <span class="shelter-badge">${shelter.type}</span>
          <div class="shelter-avatar" style="background-image: url('${shelter.avatar}')"></div>
        </div>
        <div class="shelter-content">
          <h3 class="shelter-title" style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; width: 100%;">
            <span>${shelter.name}</span>
            <a href="${shelter.website || '#'}" target="_blank" class="info-search-btn" title="Visit Official Website">i</a>
          </h3>
          <div class="shelter-location">
            Location: ${shelter.city}
          </div>
          <div class="shelter-residents" style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem; display: flex; align-items: center; gap: 0.25rem;">
            Residents: ${shelter.residents} ${shelter.resident_label || "Residents"}
          </div>
          <p class="shelter-desc" style="margin-top: 0.5rem;">${shelter.description}</p>
          <div class="needs-summary">
            <div class="needs-summary-title">Supplies Needed (${unmetCount})</div>
            <div class="needs-summary-list">
              ${tagHtml}
              ${shelter.needs.length > 3 ? `<span class="need-tag">+${shelter.needs.length - 3} more</span>` : ''}
            </div>
          </div>
          <div class="shelter-card-footer">
            <button class="btn btn-primary" onclick="openNeedsDrawer('${shelter.id}')">
              Support Shelter
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openNeedsDrawer(shelterId) {
  const shelter = SHELTERS_DB.find(s => s.id === shelterId);
  selectedShelter = shelter;

  document.getElementById("drawer-shelter-name").innerText = shelter.name;
  document.getElementById("drawer-shelter-desc").innerText = `Daily supplies matching for ${shelter.city}`;

  const listContainer = document.getElementById("drawer-needs-list");
  listContainer.innerHTML = shelter.needs.map(need => {
    const progress = Math.round((need.pledged / need.quantity) * 100);
    const isSpecial = need.isSpecialMeal;
    const unmet = need.quantity - need.pledged;

    return `
      <div class="need-list-item">
        <div class="need-meta">
          <div>
            <div class="need-name">${need.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.15rem;">
              ₹${need.price} per unit
            </div>
          </div>
          <span class="need-category-badge ${isSpecial ? 'special' : ''}">
            ${isSpecial ? 'Special Meal' : need.category}
          </span>
        </div>
        
        <div class="progress-bar-container">
          <div class="progress-bar ${isSpecial ? 'special' : ''}" style="width: ${progress}%"></div>
        </div>
        
        <div class="progress-label">
          <span><strong class="progress-pct">${unmet}</strong> units to be supplied</span>
          <span class="progress-pct">${progress}%</span>
        </div>

        ${unmet > 0 ? `
          <button class="btn sponsor-btn" onclick="openCheckoutModal('${need.id}')">
            Sponsor ${isSpecial ? 'Meal' : 'Supply'}
          </button>
        ` : `
          <button class="btn btn-secondary" style="margin-top: 1rem; cursor: not-allowed;" disabled>
            Needs Fulfilled
          </button>
        `}
      </div>
    `;
  }).join('');

  document.getElementById("needs-drawer").classList.add("open");
  document.getElementById("drawer-overlay").classList.add("open");
}

function closeNeedsDrawer() {
  const drawer = document.getElementById("needs-drawer");
  if (drawer) drawer.classList.remove("expanded");
  const expandBtn = document.querySelector(".drawer-expand-btn");
  if (expandBtn) expandBtn.innerText = "Expand Window";

  document.getElementById("needs-drawer").classList.remove("open");
  document.getElementById("checkout-modal").classList.remove("open");
  const detailsModal = document.getElementById("donation-details-modal");
  if (detailsModal) detailsModal.classList.remove("open");
  activeDetailsOrderId = null;
  document.getElementById("drawer-overlay").classList.remove("open");
}

// ==========================================
// Rendering Engine - Checkout Flow
// ==========================================

function openCheckoutModal(needId) {
  if (!selectedShelter) return;
  const need = selectedShelter.needs.find(n => n.id === needId);
  activeCheckoutNeed = need;

  document.getElementById("checkout-need-title").innerText = `Sponsor: ${need.name}`;
  document.getElementById("checkout-need-price").innerText = `₹${need.price}`;
  
  // Set default quantity input to match remaining unmet need
  const remaining = need.quantity - need.pledged;
  document.getElementById("checkout-qty").value = 1;
  document.getElementById("checkout-qty").max = remaining;

  // Prefill Owner Name and set label
  const donorLabel = document.querySelector('label[for="donor-name-input"]');
  if (donorLabel) donorLabel.innerText = "Owner Name";
  
  const donorInput = document.getElementById("donor-name-input");
  if (donorInput) donorInput.value = "Tushar Bhatia";

  // Prefill Quantity label based on item unit
  const qtyLabel = document.querySelector('label[for="checkout-qty"]');
  if (qtyLabel) {
    const nameLower = need.name.toLowerCase();
    if (nameLower.includes("atta") || nameLower.includes("dal") || nameLower.includes("rice")) {
      qtyLabel.innerText = "Weight to Sponsor (kg)";
    } else if (nameLower.includes("milk") || nameLower.includes("oil")) {
      qtyLabel.innerText = "Volume to Sponsor (Litres)";
    } else if (need.isSpecialMeal) {
      qtyLabel.innerText = "Quantity to Sponsor (meals)";
    } else {
      qtyLabel.innerText = "Quantity to Sponsor (units)";
    }
  }

  calculateCheckoutBill();

  // Reset standard screens
  document.getElementById("checkout-form-screen").style.display = "block";
  document.getElementById("checkout-success-screen").style.display = "none";
  document.getElementById("checkout-pay-btn").style.display = "block";

  document.getElementById("checkout-modal").classList.add("open");
}

function closeCheckoutModal() {
  document.getElementById("checkout-modal").classList.remove("open");
  if (activeView === "donor") {
    // Reopen drawer to show refreshed states
    openNeedsDrawer(selectedShelter.id);
  }
}

function calculateCheckoutBill() {
  const qtyInput = document.getElementById("checkout-qty");
  const qty = parseInt(qtyInput.value) || 1;
  const unitPrice = activeCheckoutNeed.price;
  const remaining = activeCheckoutNeed.quantity - activeCheckoutNeed.pledged;
  
  const payBtn = document.getElementById("checkout-pay-btn");
  
  let warningDiv = document.getElementById("checkout-qty-warning");
  if (!warningDiv) {
    warningDiv = document.createElement("div");
    warningDiv.id = "checkout-qty-warning";
    warningDiv.style.color = "var(--primary)"; // theme primary orange alert
    warningDiv.style.fontSize = "0.75rem";
    warningDiv.style.marginTop = "0.25rem";
    warningDiv.style.fontWeight = "600";
    qtyInput.parentNode.appendChild(warningDiv);
  }

  if (qty > remaining) {
    warningDiv.innerText = `Only ${remaining} unit${remaining === 1 ? '' : 's'} are needed.`;
    qtyInput.style.borderColor = "var(--primary)";
    if (payBtn) {
      payBtn.disabled = true;
      payBtn.style.opacity = "0.5";
      payBtn.innerText = "Quantity exceeds needs";
    }
  } else {
    warningDiv.innerText = "";
    qtyInput.style.borderColor = "var(--border)";
    if (payBtn) {
      payBtn.disabled = false;
      payBtn.style.opacity = "1";
      payBtn.innerText = "Pay & Sponsor";
    }
  }

  const subtotal = unitPrice * qty;
  const delivery = 39; // standard Instamart fee
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + tax;

  document.getElementById("bill-subtotal").innerText = `₹${subtotal}`;
  document.getElementById("bill-delivery").innerText = `₹${delivery}`;
  document.getElementById("bill-tax").innerText = `₹${tax}`;
  document.getElementById("bill-total").innerText = `₹${total}`;
}

async function handlePaymentSubmit() {
  const donorName = document.getElementById("donor-name-input").value.trim() || "Anonymous Donor";
  const qty = parseInt(document.getElementById("checkout-qty").value) || 1;
  
  const remaining = activeCheckoutNeed.quantity - activeCheckoutNeed.pledged;
  if (qty > remaining) {
    alert(`Only ${remaining} unit${remaining === 1 ? '' : 's'} are needed.`);
    return;
  }
  if (qty <= 0) {
    alert("Quantity must be at least 1.");
    return;
  }

  // Hide form view, display loading state inside payment button
  const payBtn = document.getElementById("checkout-pay-btn");
  payBtn.disabled = true;
  payBtn.innerText = "Authorizing CSR Secure Payment...";

  await new Promise(resolve => setTimeout(resolve, 1500)); // simulate gateway delay

  payBtn.style.display = "none";
  document.getElementById("checkout-form-screen").style.display = "none";
  
  // Launch success screen
  const successScreen = document.getElementById("checkout-success-screen");
  successScreen.style.display = "block";
  
  // Close the checkout modal and supplies drawer
  closeNeedsDrawer();
  
  // Clear console and switch to MCP Flow view to reflect the protocol transaction live
  clearConsole();
  switchView('mcp');
  
  // Fire automated task (logs will print live in the active terminal)
  const newOrder = await triggerSwiggyMcpOrderWorkflow(activeCheckoutNeed, qty, donorName);

  // Update success screen with live order details
  document.getElementById("success-msg").innerHTML = `
    <h4>Fulfillment Logged!</h4>
    <p style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-secondary)">
      Thank you for donating <strong>${qty}x ${activeCheckoutNeed.name}</strong> to ${selectedShelter.name}.
    </p>
    <div style="background: rgba(27, 36, 33, 0.02); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem; margin-top: 1rem; font-family: var(--font-mono); font-size: 0.8rem; text-align: left;">
      <div>Pledge Ref: <strong style="color: var(--secondary)">${newOrder.swiggyOrderId}</strong></div>
      <div>Delivery: <span class="badge-status placed" style="padding: 0.1rem 0.4rem; font-size: 0.65rem;">Placed</span></div>
      <div style="margin-top: 0.25rem; font-size: 0.75rem; color: var(--text-secondary)">
        Staging pledge finalized. Direct delivery to the verified nursing home doorstep is logged. You can monitor this live on the Admin Dashboard!
      </div>
    </div>
  `;
}

// ==========================================
// Rendering Engine - Shelter Admin View
// ==========================================

function renderAdminPanel() {
  const activeNeedsGrid = document.getElementById("admin-needs-list");
  const ordersQueueList = document.getElementById("admin-orders-queue");
  if (!activeNeedsGrid || !ordersQueueList) return;

  if (!selectedShelter) {
    activeNeedsGrid.innerHTML = `
      <div style="text-align: center; color: var(--text-secondary); padding: 2rem 0; font-size: 0.9rem;">
        No active needs. Please add a shelter and post requirements.
      </div>
    `;
    ordersQueueList.innerHTML = `
      <div style="text-align: center; color: var(--text-secondary); padding: 2rem 0; font-size: 0.9rem;">
        No active orders.
      </div>
    `;
    return;
  }

  // Render Shelter Needs
  activeNeedsGrid.innerHTML = selectedShelter.needs.map(need => {
    const isSpecial = need.isSpecialMeal;
    const weightVal = getWeightOrVolume(need);
    const progress = Math.min(100, Math.round((need.delivered / need.quantity) * 100));

    return `
      <div class="need-list-item" style="margin-bottom: 0.75rem;">
        <div class="need-meta" style="margin-bottom: 0.25rem;">
          <span style="font-weight: 600; font-size: 0.9rem;">${need.name}</span>
          <span class="need-category-badge ${isSpecial ? 'special' : ''}" style="font-size: 0.65rem;">
            ${isSpecial ? 'Special Meal' : need.category}
          </span>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">
          Weight / Size: ${weightVal} | Quantity: ${need.quantity}
        </div>
        <div class="progress-label" style="font-size: 0.75rem;">
          <span>Requested: ${need.quantity} | Delivered: <strong style="color: #10B981;">${need.delivered}</strong></span>
          <span>${progress}%</span>
        </div>
        <div class="progress-bar-container" style="height: 6px; margin: 0.35rem 0 0;">
          <div class="progress-bar ${isSpecial ? 'special' : ''}" style="width: ${progress}%"></div>
        </div>
      </div>
    `;
  }).join('');

  // Render Orders Queue
  const filteredOrders = PLEDGES_QUEUE.filter(o => o.shelterId === selectedShelter.id);
  
  if (filteredOrders.length === 0) {
    ordersQueueList.innerHTML = `
      <div style="text-align: center; color: var(--text-secondary); padding: 2rem 0; font-size: 0.9rem;">
        No active orders or donations for this shelter yet.
      </div>
    `;
    return;
  }

  ordersQueueList.innerHTML = filteredOrders.map(order => {
    let mapHtml = '';
    
    // Add real-time live map animation if the order is active
    if (order.status === "in_transit" || order.status === "placed") {
      const bikeOffset = order.deliveryProgress || 15;
      mapHtml = `
        <div class="map-simulator">
          <div class="map-road"></div>
          <div class="map-marker shop"><div class="hub-marker">Hub</div></div>
          <div class="map-label shop">Swiggy Hub</div>
          
          <div class="map-bike" style="left: ${bikeOffset}%"><div class="bike-marker">Courier</div></div>
          
          <div class="map-marker shelter"><div class="shelter-marker">Shelter</div></div>
          <div class="map-label shelter">${selectedShelter.name.split(' ')[0]}</div>
          
          <div style="position: absolute; bottom: 0.5rem; left: 1rem; font-size: 0.75rem; color: var(--text-secondary);">
            Swiggy Partner: <strong>Ramesh (98888)</strong> | ETA: ~${order.eta || 10} mins
          </div>
        </div>
      `;
    }

    return `
      <div class="order-item-card">
        <div class="order-details">
          <h4>${order.itemName}</h4>
          <div class="order-meta-info">
            <span>Sponsor: <strong>${order.donorName}</strong></span>
            <span>Qty: <strong>${order.quantity}</strong></span>
            <span>Est. Bill: <strong>₹${order.amount}</strong></span>
            <span>MCP ID: <strong style="font-family: var(--font-mono); color: var(--secondary);">${order.swiggyOrderId}</strong></span>
          </div>
          ${mapHtml}
        </div>
        <div>
          <span class="badge-status ${order.status}">
            ${order.status.replace('_', ' ')}
          </span>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================
// Dynamic Catalog & Cascading Unit Logic
// ==========================================

const ITEMS_CATALOG = {
  "GROCERY": [
    { name: "Basmati Rice", unitType: "weight" },
    { name: "Chakki Wheat Atta", unitType: "weight" },
    { name: "Toor Dal", unitType: "weight" },
    { name: "Refined Sugar", unitType: "weight" },
    { name: "Fortune Mustard Oil", unitType: "liquid" },
    { name: "Amul Fresh Milk", unitType: "liquid" }
  ],
  "TOILETRIES": [
    { name: "Dettol Liquid Handwash", unitType: "liquid" },
    { name: "Lifebuoy Antiseptic Soap", unitType: "discrete" },
    { name: "Floor Disinfectant Cleaner", unitType: "liquid" }
  ],
  "MEDICINE": [
    { name: "Paracetamol 650mg Tablets", unitType: "discrete" },
    { name: "Antiseptic Liquid Solution", unitType: "liquid" },
    { name: "First Aid Dressing Kit", unitType: "discrete" }
  ],
  "PERSONAL_CARE": [
    { name: "Adult Diaper Pack", unitType: "discrete" },
    { name: "Savlons Antiseptic Soap", unitType: "discrete" },
    { name: "Moisturizing Skin Lotion", unitType: "liquid" }
  ],
  "ENTERTAINMENT": [
    { name: "Wooden Ludo & Snakes Board", unitType: "discrete" },
    { name: "Standard Playing Cards Pack", unitType: "discrete" },
    { name: "Children Story Books Collection", unitType: "discrete" }
  ],
  "SPECIAL_MEAL": [
    { name: "Royal Vegetable Biryani", unitType: "none" },
    { name: "Paneer Butter Masala & Garlic Naan Combo", unitType: "none" },
    { name: "Sadhya Idli & Dosa Combo", unitType: "none" },
    { name: "Festive Gulab Jamun Platter", unitType: "none" }
  ]
};

function handleCategoryChange() {
  const catSelect = document.getElementById("need-category-select");
  const itemSelect = document.getElementById("need-name-select");
  if (!catSelect || !itemSelect) return;

  const category = catSelect.value;
  const items = ITEMS_CATALOG[category] || [];

  // Populate item selector
  itemSelect.innerHTML = items.map(item => `
    <option value="${item.name}" data-unit="${item.unitType}">${item.name}</option>
  `).join('');

  // Trigger cascade item change to set up unit sizes
  handleItemChange();
}

function handleItemChange() {
  const itemSelect = document.getElementById("need-name-select");
  const variantSelect = document.getElementById("need-variant-select");
  const variantGroup = document.getElementById("form-group-variant");
  if (!itemSelect || !variantSelect || !variantGroup) return;

  const selectedOption = itemSelect.options[itemSelect.selectedIndex];
  if (!selectedOption) return;

  const unitType = selectedOption.getAttribute("data-unit");

  if (unitType === "none") {
    // Hide variant group for Special Meals
    variantGroup.style.display = "none";
    variantSelect.innerHTML = `<option value="Standard Portion">Standard Portion</option>`;
  } else {
    variantGroup.style.display = "block";

    if (unitType === "weight") {
      // Weight items only support mass units
      variantSelect.innerHTML = `
        <option value="1kg">1 kg (Standard)</option>
        <option value="5kg">5 kg (Large Pack)</option>
        <option value="10kg">10 kg (Bulk Pack)</option>
      `;
    } else if (unitType === "liquid") {
      // Liquid items only support volume units
      variantSelect.innerHTML = `
        <option value="250ml">250 ml (Small Cup/Bottle)</option>
        <option value="500ml">500 ml (Medium Bottle)</option>
        <option value="1L">1 Litre (Standard Carton)</option>
      `;
    } else if (unitType === "discrete") {
      // Discrete items only support pack quantities
      variantSelect.innerHTML = `
        <option value="Pack of 1">Single Item / Unit</option>
        <option value="Pack of 4">Pack of 4 Units</option>
      `;
    }
  }
}

function calculateAutomaticPrice(category, name, size) {
  const lowerName = name.toLowerCase();
  
  if (category === "SPECIAL_MEAL") {
    if (lowerName.includes("biryani")) return 280;
    if (lowerName.includes("paneer") || lowerName.includes("butter masala")) return 340;
    if (lowerName.includes("dosa") || lowerName.includes("idli")) return 140;
    if (lowerName.includes("gulab jamun") || lowerName.includes("sweet")) return 210;
    return 220; // standard flat rate
  }
  
  // Grocery Pricing
  if (category === "GROCERY") {
    if (size === "10kg") return 460;
    if (size === "5kg") return 240;
    if (size === "1kg") return 65;
    if (size === "500ml") return 48;
    if (size === "1L") return 74;
    if (size === "250ml") return 25;
    return 85; // fallback
  }
  
  // Toiletries
  if (category === "TOILETRIES") {
    if (size === "1L") return 219;
    if (size === "Pack of 4") return 180;
    if (size === "500ml") return 90;
    return 60;
  }
  
  // First Aid / Medicines
  if (category === "MEDICINE") {
    if (size === "Pack of 4") return 120;
    return 45;
  }
  
  // Personal Care & Hygiene
  if (category === "PERSONAL_CARE") {
    if (size === "Pack of 4") return 180;
    if (size === "1L") return 240;
    if (size === "500ml") return 130;
    return 350;
  }
  
  // Toys & Entertainment
  if (category === "ENTERTAINMENT") {
    if (size === "Pack of 4") return 550;
    return 190;
  }
  
  return 120; // global fallback
}

function handleAddNeedSubmit(event) {
  event.preventDefault();
  
  if (!selectedShelter) {
    alert("Please select or create a shelter first.");
    return;
  }
  
  const qtyInput = document.getElementById("need-qty-input");
  const catSelect = document.getElementById("need-category-select");
  const itemSelect = document.getElementById("need-name-select");
  const variantSelect = document.getElementById("need-variant-select");

  const rawName = itemSelect.value;
  const qty = parseInt(qtyInput.value) || 5;
  const category = catSelect.value;
  const size = variantSelect.value;
  const isSpecial = category === "SPECIAL_MEAL";

  if (!rawName) return;

  // Append size logically to product name for non-special meals
  const name = isSpecial ? rawName : `${rawName} ${size}`;
  const price = calculateAutomaticPrice(category, rawName, size);

  const newNeed = {
    id: `need_${selectedShelter.id}_${Math.floor(Math.random()*1000)}`,
    name: name,
    category: isSpecial ? "SPECIAL MEAL" : category,
    quantity: qty,
    pledged: 0,
    delivered: 0,
    price: price,
    type: isSpecial ? "food" : "instamart",
    isSpecialMeal: isSpecial,
    favoriteFood: isSpecial ? rawName : null,
    restaurantId: isSpecial ? (rawName.toLowerCase().includes("biryani") ? "rest_bikanervala" : "rest_haldiram") : null,
    spinId: isSpecial ? null : `sku_custom_${Math.floor(Math.random()*1000)}`
  };

  selectedShelter.needs.push(newNeed);
  saveDatabase();
  
  logToConsole("info", `Admin added new need: "${name}" | Goal: ${qty} units | Automatic Price Locked: ₹${price} (calculated via catalog size mapping)`, null);

  // Reset form and reinitialize selector
  qtyInput.value = "10";
  catSelect.value = "GROCERY";
  handleCategoryChange();

  closeAddNeedModal();

  renderShelters();
  renderAdminPanel();
}

function selectAdminShelter(shelterId) {
  selectedShelter = SHELTERS_DB.find(s => s.id === shelterId);
  
  // Highlight active shelter button
  const btns = document.querySelectorAll(".shelter-select-btn");
  btns.forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-id") === shelterId);
  });

  renderAdminPanel();
}

function setCauseFilter(causeType) {
  activeCauseFilter = causeType;
  
  // Toggle active styling on buttons
  const buttons = ["all", "eldercare", "child_welfare", "animal_welfare"];
  buttons.forEach(btn => {
    const el = document.getElementById(`cause-btn-${btn}`);
    if (el) {
      el.classList.toggle("active", btn === causeType);
    }
  });
  
  renderShelters();
}

// ==========================================
// Initialization & Tab Controls
// ==========================================

function switchView(view) {
  activeView = view;
  
  // Toggle active views
  document.getElementById("view-btn-donor").classList.toggle("active", view === "donor");
  document.getElementById("view-btn-admin").classList.toggle("active", view === "admin");
  document.getElementById("view-btn-mcp").classList.toggle("active", view === "mcp");
  
  document.getElementById("view-donor").classList.toggle("active", view === "donor");
  document.getElementById("view-admin").classList.toggle("active", view === "admin");
  document.getElementById("view-mcp").classList.toggle("active", view === "mcp");

  if (view === "admin") {
    // Populate admin sidebar select
    const sidebarList = document.getElementById("admin-shelter-select-list");
    if (sidebarList) {
      sidebarList.innerHTML = SHELTERS_DB.map(s => `
        <button class="shelter-select-btn ${s.id === selectedShelter.id ? 'active' : ''}" 
                data-id="${s.id}" onclick="selectAdminShelter('${s.id}')">
          <img src="${s.avatar}" alt="${s.name}"/>
          <div class="btn-text">
            <h4>${s.name}</h4>
            <p>${s.city}</p>
          </div>
        </button>
      `).join('');
    }

    renderAdminPanel();
  } else if (view === "donor") {
    renderShelters();
    renderDonationHistory();
  }
}

// ==========================================
// Donation History Sidebar & Details Modal
// ==========================================

function renderDonationHistory() {
  const historyList = document.getElementById("donor-history-list");
  if (!historyList) return;

  // Calculate stats for Tushar Bhatia
  const userPledges = PLEDGES_QUEUE.filter(o => o.donorName === "Tushar Bhatia");
  const totalAmount = userPledges.reduce((sum, o) => sum + o.amount, 0);
  const totalCount = userPledges.length;

  // Update Stats UI
  const totalEl = document.getElementById("donor-stats-total");
  const countEl = document.getElementById("donor-stats-count");
  if (totalEl) totalEl.innerText = `₹${totalAmount.toLocaleString('en-IN')}`;
  if (countEl) countEl.innerText = totalCount;

  if (userPledges.length === 0) {
    historyList.innerHTML = `
      <div style="text-align: center; color: var(--text-secondary); padding: 1.5rem; font-size: 0.85rem;">
        No donations made yet.
      </div>
    `;
    return;
  }

  historyList.innerHTML = userPledges.map(order => {
    const shelter = SHELTERS_DB.find(s => s.id === order.shelterId) || { name: "Verified Shelter", city: "Mumbai" };
    
    // Choose category initial letter and class based on category or name
    let catLetter = "D";
    let catClass = "donation";
    const cat = (order.category || "").toUpperCase();
    if (cat.includes("GROCERY")) { catLetter = "G"; catClass = "grocery"; }
    else if (cat.includes("TOILETRIES")) { catLetter = "T"; catClass = "toiletries"; }
    else if (cat.includes("MEDICINE")) { catLetter = "M"; catClass = "medicine"; }
    else if (cat.includes("PERSONAL")) { catLetter = "P"; catClass = "personal"; }
    else if (cat.includes("ENTERTAINMENT")) { catLetter = "E"; catClass = "entertainment"; }
    else if (cat.includes("SPECIAL")) { catLetter = "S"; catClass = "special"; }

    const statusLabel = order.status.replace('_', ' ');

    return `
      <div class="history-item" onclick="openDonationDetailsModal('${order.id}')" data-order-id="${order.id}">
        <div class="history-icon category-icon-${catClass}">${catLetter}</div>
        <div class="history-details">
          <h4>${order.itemName}</h4>
          <p>${shelter.name}</p>
          <span style="font-size: 0.65rem; color: var(--text-secondary);">${order.date || 'Today'}</span>
        </div>
        <div class="history-meta">
          <span class="history-amount">₹${order.amount}</span>
          <span class="history-status ${order.status}">${statusLabel}</span>
        </div>
      </div>
    `;
  }).join('');
}

function openDonationDetailsModal(orderId) {
  activeDetailsOrderId = orderId;
  const order = PLEDGES_QUEUE.find(o => o.id === orderId);
  if (!order) return;

  const shelter = SHELTERS_DB.find(s => s.id === order.shelterId) || {
    name: "Verified Shelter",
    city: "Mumbai",
    address: "Mumbai, India",
    website: "#"
  };

  const modal = document.getElementById("donation-details-modal");
  const body = document.getElementById("details-modal-body");
  if (!modal || !body) return;

  let statusColor = "var(--primary)";
  let statusDesc = "";
  if (order.status === "delivered") {
    statusColor = "#10B981";
    statusDesc = "Delivered to the shelter doorstep.";
  } else if (order.status === "in_transit") {
    statusColor = "#06B6D4";
    statusDesc = `In Transit. Delivery partner is on the way (ETA: ~${order.eta || 10} mins).`;
  } else if (order.status === "cancelled") {
    statusColor = "#ef4444";
    statusDesc = "This order was cancelled. Pledge resources reverted.";
  } else {
    statusColor = "#3B82F6";
    statusDesc = "Order placed successfully. Waiting for dispatch.";
  }

  let progressHtml = "";
  if (order.status === "cancelled") {
    progressHtml = `
      <div style="margin-top: 1rem; background: rgba(239, 68, 68, 0.05); border: 1px dashed #ef4444; border-radius: var(--radius-sm); padding: 0.75rem; color: #ef4444; font-size: 0.8rem; font-weight: 600; text-align: center;">
        Order Cancelled & Pledge Reverted
      </div>
    `;
  } else if (order.status !== "delivered") {
    const progress = order.deliveryProgress || 15;
    progressHtml = `
      <div style="margin-top: 1rem;">
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.25rem;">
          <span>Delivery Progress</span>
          <span>${progress}%</span>
        </div>
        <div class="progress-bar-container" style="height: 8px; border-radius: 4px; overflow: hidden; background: var(--border);">
          <div class="progress-bar" style="width: ${progress}%; background: var(--secondary); height: 100%; transition: width 0.3s ease;"></div>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.4rem; display: flex; align-items: center; gap: 0.25rem; justify-content: space-between;">
          <span>Live delivery partner: <strong>Ramesh (98888)</strong></span>
          <button class="btn" onclick="cancelOrder('${order.id}')" style="background: #ef4444; color: white; font-size: 0.65rem; padding: 0.2rem 0.5rem; width: auto; font-weight: 700; border-radius: 4px; display: inline-flex;">Cancel Order</button>
        </div>
      </div>
    `;
  } else {
    progressHtml = `
      <div style="margin-top: 1rem; background: rgba(16, 185, 129, 0.05); border: 1px dashed #10B981; border-radius: var(--radius-sm); padding: 0.75rem; display: flex; align-items: center; gap: 0.5rem; color: #10B981; font-size: 0.8rem;">
        <strong>Delivery Completed!</strong> Handed over to ${shelter.name} representative.
      </div>
    `;
  }

  // Calculate bill breakdown
  const deliveryFee = 39;
  const subtotal = Math.max(0, Math.round((order.amount - deliveryFee) / 1.05));
  const taxes = order.amount - subtotal - deliveryFee;

  let auditTrailHtml = "";
  if (order.mcpAuditTrail && order.mcpAuditTrail.length > 0) {
    const logLinesHtml = order.mcpAuditTrail.map(log => {
      let cssClass = "";
      let label = "";
      if (log.type === "rpc-req") {
        cssClass = "log-agent";
        label = `--> JSON-RPC Request (${log.label})`;
      } else if (log.type === "rpc-res") {
        cssClass = "log-mcp";
        label = `<-- JSON-RPC Response (${log.label})`;
      } else {
        cssClass = "log-line";
        label = `[SYSTEM INFO] ${log.label}`;
      }
      
      const preHtml = log.data ? `<pre class="log-json" style="font-size: 0.7rem; padding: 0.35rem; margin: 0.15rem 0; background: rgba(255, 255, 255, 0.05); color: #cbd5e1; font-family: var(--font-mono);">${JSON.stringify(log.data, null, 2)}</pre>` : "";
      return `
        <div class="log-line" style="margin-bottom: 0.5rem; line-height: 1.3;">
          <span class="console-timestamp" style="font-size: 0.7rem; opacity: 0.6; color: #64748b;">[${log.time}]</span> 
          <span class="${cssClass}" style="font-size: 0.75rem;">${label}</span>
          ${preHtml}
        </div>`;
    }).join('');

    auditTrailHtml = `
      <div style="border-top: 1px solid var(--border); padding-top: 0.75rem; margin-top: 0.5rem;">
        <h4 style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); margin-bottom: 0.35rem; font-weight: 600;">MCP Protocol Audit Trail</h4>
        <details style="border: 1px solid var(--border); border-radius: 6px; padding: 0.5rem; background: var(--surface);">
          <summary style="font-size: 0.8rem; font-weight: 700; cursor: pointer; color: var(--primary);">View JSON-RPC Protocol Logs</summary>
          <div class="mcp-terminal" style="font-family: var(--font-mono); font-size: 0.75rem; margin-top: 0.5rem; max-height: 220px; overflow-y: auto; background: #0f172a; padding: 0.75rem; border-radius: 4px; display: flex; flex-direction: column; gap: 0.5rem; border: 1px solid #334155;">
            ${logLinesHtml}
          </div>
        </details>
      </div>
    `;
  }

  body.innerHTML = `
    <div style="padding: 1rem; display: flex; flex-direction: column; gap: 1rem;">
      
      <!-- Status Card -->
      <div style="display: flex; align-items: center; gap: 0.75rem; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 0.85rem;">
        <div>
          <div style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: ${statusColor};">
            ${order.status.replace('_', ' ')}
          </div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.15rem; line-height: 1.3;">
            ${statusDesc}
          </div>
        </div>
      </div>

      <!-- Item details -->
      <div>
        <h4 style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); margin-bottom: 0.35rem; font-weight: 600;">Donated Item</h4>
        <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.65rem;">
          <div>
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">${order.itemName}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.15rem;">Quantity: ${order.quantity} units</div>
          </div>
          <div style="font-size: 0.95rem; font-weight: 800; color: var(--primary);">₹${order.amount.toLocaleString('en-IN')}</div>
        </div>
      </div>

      <!-- Shelter details -->
      <div>
        <h4 style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); margin-bottom: 0.35rem; font-weight: 600;">Beneficiary Shelter</h4>
        <div style="background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.65rem;">
          <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); display: flex; align-items: center; justify-content: space-between;">
            <span>${shelter.name}</span>
            <a href="${shelter.website || '#'}" target="_blank" style="font-size: 0.75rem; color: var(--primary); text-decoration: underline;">Website ↗</a>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem; line-height: 1.35;">
            Address: ${shelter.address || shelter.city}
          </div>
        </div>
      </div>

      <!-- Payment & Bill Details -->
      <div>
        <h4 style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); margin-bottom: 0.35rem; font-weight: 600;">Bill Breakdown</h4>
        <div style="background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.65rem; font-size: 0.8rem; display: flex; flex-direction: column; gap: 0.25rem;">
          <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
            <span>Subtotal:</span>
            <span>₹${subtotal}</span>
          </div>
          <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
            <span>Delivery Fee:</span>
            <span>₹${deliveryFee}</span>
          </div>
          <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
            <span>GST & Packaging:</span>
            <span>₹${taxes}</span>
          </div>
          <hr style="border: 0; border-top: 1px solid var(--border); margin: 0.35rem 0;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--text-primary);">
            <span>Total Amount Paid:</span>
            <span>₹${order.amount}</span>
          </div>
        </div>
      </div>

      <!-- Order Meta -->
      <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); border-top: 1px solid var(--border); padding-top: 0.5rem; margin-top: 0.25rem;">
        <span>Date: <strong>${order.date || 'Today'}</strong></span>
        <span>Order ID: <strong style="font-family: var(--font-mono);">${order.swiggyOrderId}</strong></span>
      </div>

      <!-- Live Progress -->
      ${progressHtml}

      <!-- MCP Audit Trail -->
      ${auditTrailHtml}

    </div>
  `;

  modal.classList.add("open");
  document.getElementById("drawer-overlay").classList.add("open");
}

function closeDonationDetailsModal() {
  activeDetailsOrderId = null;
  document.getElementById("donation-details-modal").classList.remove("open");
  
  const detailsOpen = document.getElementById("donation-details-modal").classList.contains("open");
  const checkoutOpen = document.getElementById("checkout-modal").classList.contains("open");
  const drawerOpen = document.getElementById("needs-drawer").classList.contains("open");
  
  if (!detailsOpen && !checkoutOpen && !drawerOpen) {
    document.getElementById("drawer-overlay").classList.remove("open");
  }
}

function goToDonationHistory() {
  // Close modals
  document.getElementById("checkout-modal").classList.remove("open");
  document.getElementById("donation-details-modal").classList.remove("open");
  document.getElementById("needs-drawer").classList.remove("open");
  document.getElementById("drawer-overlay").classList.remove("open");

  // Ensure donor view is active
  switchView('donor');

  // Scroll sidebar into view smoothly
  const sidebar = document.getElementById("donor-sidebar-panel");
  if (sidebar) {
    sidebar.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Add flash-highlight classes to first history item
  setTimeout(() => {
    const firstItem = document.querySelector("#donor-history-list .history-item");
    if (firstItem) {
      firstItem.classList.add("flash-highlight");
      // Remove class after animation finishes (1.5s)
      firstItem.addEventListener("animationend", () => {
        firstItem.classList.remove("flash-highlight");
      }, { once: true });
    }
  }, 500);
}

function toggleSidebar() {
  const sidebar = document.getElementById("donor-sidebar-panel");
  const layout = document.querySelector(".donor-view-layout");
  const btn = document.querySelector(".sidebar-toggle-btn");
  
  if (sidebar && layout) {
    sidebar.classList.toggle("collapsed");
    layout.classList.toggle("sidebar-collapsed");
    
    if (sidebar.classList.contains("collapsed")) {
      if (btn) {
        btn.innerText = "▶";
        btn.title = "Expand Sidebar";
      }
    } else {
      if (btn) {
        btn.innerText = "◀ Collapse";
        btn.title = "Collapse Sidebar";
      }
    }
  }
}

function toggleTheme() {
  document.documentElement.classList.toggle("dark-mode");
  const isDark = document.body.classList.toggle("dark-mode");
  const icon = document.querySelector(".theme-icon");
  const btn = document.getElementById("theme-toggle-btn");
  
  if (isDark) {
    if (icon) icon.innerText = "☀";
    if (btn) btn.title = "Switch to Light Mode";
    localStorage.setItem("nf_theme", "dark");
  } else {
    if (icon) icon.innerText = "☾";
    if (btn) btn.title = "Switch to Dark Mode";
    localStorage.setItem("nf_theme", "light");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  clearConsole();
  
  // Load theme preference on boot
  const savedTheme = localStorage.getItem("nf_theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark-mode");
    document.body.classList.add("dark-mode");
    const icon = document.querySelector(".theme-icon");
    if (icon) icon.innerText = "☀";
    const btn = document.getElementById("theme-toggle-btn");
    if (btn) btn.title = "Switch to Light Mode";
  }

  // Set up theme toggle listener
  const themeBtn = document.getElementById("theme-toggle-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
  }

  renderShelters();
  renderDonationHistory();
  
  // Set default donor name
  const donorInput = document.getElementById("donor-name-input");
  if (donorInput) {
    donorInput.value = "Tushar Bhatia";
  }

  // Set up add need listener
  const form = document.getElementById("admin-add-need-form");
  if (form) form.addEventListener("submit", handleAddNeedSubmit);

  // Populate cascading selectors on startup
  handleCategoryChange();

  // Periodically process mock deliveries for preexisting orders
  setInterval(() => {
    PLEDGES_QUEUE.forEach(order => {
      if (order.status === "in_transit" || order.status === "placed") {
        if (!order.deliveryProgress) order.deliveryProgress = 15;
        order.deliveryProgress += 10;
        
        if (order.deliveryProgress >= 100) {
          order.status = "delivered";
          order.deliveryProgress = 100;
          
          saveDatabase();
          logToConsole("info", `DELIVERED! Mock order ${order.swiggyOrderId} successfully completed.`, null);
          renderShelters();
        } else {
          order.status = "in_transit";
        }

        // Re-render modal if open
        if (activeDetailsOrderId === order.id) {
          openDonationDetailsModal(order.id);
        }
      }
    });
    saveDatabase();
    renderDonationHistory();
    if (activeView === "admin") renderAdminPanel();
  }, 12000);
});

function openAddNeedModal() {
  const modal = document.getElementById("admin-add-need-modal");
  const overlay = document.getElementById("drawer-overlay");
  if (modal && overlay) {
    modal.classList.add("open");
    overlay.classList.add("open");
  }
}

function closeAddNeedModal() {
  const modal = document.getElementById("admin-add-need-modal");
  const overlay = document.getElementById("drawer-overlay");
  if (modal && overlay) {
    modal.classList.remove("open");
    overlay.classList.remove("open");
  }
}

function toggleExpandNeedsDrawer() {
  const drawer = document.getElementById("needs-drawer");
  if (drawer) {
    const isExpanded = drawer.classList.toggle("expanded");
    const btn = document.querySelector(".drawer-expand-btn");
    if (btn) {
      btn.innerText = isExpanded ? "Collapse Window" : "Expand Window";
    }
  }
}

function setMcpPrompt(text) {
  const input = document.getElementById("mcp-prompt-input");
  if (input) input.value = text;
}

function clearMcpTerminal() {
  const terminal = document.getElementById("mcp-terminal-console");
  if (terminal) {
    terminal.innerHTML = `<div class="log-line">--- Swiggy Model Context Protocol (MCP) Terminal Connected ---</div>`;
  }
}

let mcpSimTimeout = null;
function runMcpSimulation() {
  const input = document.getElementById("mcp-prompt-input");
  const terminal = document.getElementById("mcp-terminal-console");
  if (!input || !terminal) return;

  const prompt = input.value.trim() || "Sponsor Atta to Banyan Tree Care Facility";
  
  if (mcpSimTimeout) {
    clearTimeout(mcpSimTimeout);
  }
  
  terminal.innerHTML = `<div class="log-line">--- Swiggy Model Context Protocol (MCP) Terminal Connected ---</div>`;
  
  let shelterName = "The Banyan Tree Geriatric Care";
  let shelterAddrId = "addr_aasha_99";
  let itemName = "Aashirvaad Shudh Chakki Atta 10kg";
  let sku = "sku_atta_10k";
  let unitPrice = 460;
  let qty = 5;

  const pLower = prompt.toLowerCase();
  if (pLower.includes("manav") || pLower.includes("shah") || pLower.includes("sion")) {
    shelterName = "C.U. Shah Senior Citizens Home";
    shelterAddrId = "addr_kalyan_88";
  } else if (pLower.includes("adharwad") || pLower.includes("seawoods")) {
    shelterName = "Adharwad Old Age Home";
    shelterAddrId = "addr_paws_77";
  } else if (pLower.includes("dhanwantari") || pLower.includes("thane")) {
    shelterName = "Dhanwantari Old Age Home";
    shelterAddrId = "addr_dhanwantari_66";
  }

  if (pLower.includes("milk")) {
    itemName = "Amul Taaza Fresh Milk 1L Pack";
    sku = "sku_milk_1l";
    unitPrice = 74;
    qty = 15;
  } else if (pLower.includes("oil")) {
    itemName = "Fortune Mustard Oil 1L";
    sku = "sku_oil_1l";
    unitPrice = 175;
    qty = 10;
  } else if (pLower.includes("paneer") || pLower.includes("combo") || pLower.includes("meal")) {
    itemName = "Paneer Butter Masala & Garlic Naan Combo";
    sku = "sku_paneer_combo";
    unitPrice = 340;
    qty = 12;
  }

  const logs = [
    { text: `[Agent] Initializing reasoning loop...`, type: "agent" },
    { text: `[Agent] User intent: "${prompt}"`, type: "agent" },
    { text: `[Agent] Matching intent to Swiggy Instamart catalog...`, type: "agent" },
    { text: `[Agent] Call tool: "swiggy_search_catalog"`, type: "agent" },
    { text: JSON.stringify({
        "jsonrpc": "2.0",
        "method": "tools/call",
        "params": {
          "name": "swiggy_search_catalog",
          "arguments": {
            "query": itemName.split(' ')[0],
            "store_type": itemName.toLowerCase().includes("combo") ? "food" : "instamart"
          }
        },
        "id": 1
      }, null, 2), type: "json" },
    { text: `[MCP Server] Response: Found matching item in catalog.`, type: "mcp" },
    { text: JSON.stringify({
        "jsonrpc": "2.0",
        "result": {
          "items": [
            {
              "sku": sku,
              "name": itemName,
              "price": unitPrice,
              "in_stock": true
            }
          ]
        },
        "id": 1
      }, null, 2), type: "json" },
    { text: `[Agent] Formulating cart list. Item: "${itemName}" | Quantity: ${qty}`, type: "agent" },
    { text: `[Agent] Call tool: "swiggy_add_to_cart"`, type: "agent" },
    { text: JSON.stringify({
        "jsonrpc": "2.0",
        "method": "tools/call",
        "params": {
          "name": "swiggy_add_to_cart",
          "arguments": {
            "sku": sku,
            "quantity": qty
          }
        },
        "id": 2
      }, null, 2), type: "json" },
    { text: `[MCP Server] Response: Cart updated successfully.`, type: "mcp" },
    { text: JSON.stringify({
        "jsonrpc": "2.0",
        "result": {
          "status": "success",
          "cart_id": "cart_swiggy_993",
          "total_items": qty,
          "subtotal": unitPrice * qty
        },
        "id": 2
      }, null, 2), type: "json" },
    { text: `[Agent] Resolving destination delivery address ID...`, type: "agent" },
    { text: `[Agent] Call tool: "swiggy_get_address_id"`, type: "agent" },
    { text: JSON.stringify({
        "jsonrpc": "2.0",
        "method": "tools/call",
        "params": {
          "name": "swiggy_get_address_id",
          "arguments": {
            "shelter_name": shelterName
          }
        },
        "id": 3
      }, null, 2), type: "json" },
    { text: `[MCP Server] Response: Target address verified.`, type: "mcp" },
    { text: JSON.stringify({
        "jsonrpc": "2.0",
        "result": {
          "address_id": shelterAddrId,
          "formatted_address": "Verified Delivery Point, Mumbai"
        },
        "id": 3
      }, null, 2), type: "json" },
    { text: `[Agent] Constructing checkout session and calculating bill...`, type: "agent" },
    { text: `[Agent] Call tool: "swiggy_place_order"`, type: "agent" },
    { text: JSON.stringify({
        "jsonrpc": "2.0",
        "method": "tools/call",
        "params": {
          "name": "swiggy_place_order",
          "arguments": {
            "cart_id": "cart_swiggy_993",
            "address_id": shelterAddrId,
            "payment_method": "donation_credit"
          }
        },
        "id": 4
      }, null, 2), type: "json" },
    { text: `[MCP Server] Response: Order successfully placed! dispatching courier.`, type: "mcp" },
    { text: JSON.stringify({
        "jsonrpc": "2.0",
        "result": {
          "order_id": `SWIGGY-${Math.floor(Math.random()*90000)+10000}-IM`,
          "status": "placed",
          "eta": 15,
          "delivery_partner": "Ramesh (98888)"
        },
        "id": 4
      }, null, 2), type: "json" },
    { text: `[Agent] Success! Swiggy order created. Tracking dispatch status to "${shelterName}".`, type: "agent" }
  ];

  let currentLogIdx = 0;
  function printNextLine() {
    if (currentLogIdx >= logs.length) return;
    const log = logs[currentLogIdx];
    
    let html = '';
    if (log.type === "agent") {
      html = `<div class="log-line log-agent">${log.text}</div>`;
    } else if (log.type === "mcp") {
      html = `<div class="log-line log-mcp">${log.text}</div>`;
    } else {
      html = `<pre class="log-json">${log.text}</pre>`;
    }
    
    terminal.innerHTML += html;
    terminal.scrollTop = terminal.scrollHeight;
    
    currentLogIdx++;
    mcpSimTimeout = setTimeout(printNextLine, 600);
  }

  printNextLine();
}

function cancelOrder(orderId) {
  const order = PLEDGES_QUEUE.find(o => o.id === orderId);
  if (!order) return;

  if (order.status === "cancelled") {
    alert("This order is already cancelled.");
    return;
  }

  if (!confirm("Are you sure you want to cancel this order?")) {
    return;
  }

  const shelter = SHELTERS_DB.find(s => s.id === order.shelterId);
  if (shelter) {
    const need = shelter.needs.find(n => n.name === order.itemName);
    if (need) {
      const units = order.unitsToSupply || order.quantity || 0;
      need.pledged = Math.max(0, need.pledged - units);
      need.delivered = Math.max(0, need.delivered - units);
    }
  }

  order.status = "cancelled";
  order.deliveryProgress = 0;
  
  if (window.deliveryTimers && window.deliveryTimers[order.id]) {
    clearInterval(window.deliveryTimers[order.id]);
    delete window.deliveryTimers[order.id];
  }

  saveDatabase();

  renderShelters();
  renderDonationHistory();
  if (activeView === "admin") {
    renderAdminPanel();
  }

  if (activeDetailsOrderId === order.id) {
    openDonationDetailsModal(order.id);
  }
}

function downloadMcpLogs(orderId) {
  const order = PLEDGES_QUEUE.find(o => o.id === orderId);
  if (!order || !order.mcpAuditTrail) return;

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(order.mcpAuditTrail, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `mcp-audit-${order.swiggyOrderId}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Export handlers to window for ESM / Vite compatibility
window.switchView = switchView;
window.clearConsole = clearConsole;
window.closeNeedsDrawer = closeNeedsDrawer;
window.openNeedsDrawer = openNeedsDrawer;
window.openCheckoutModal = openCheckoutModal;
window.closeCheckoutModal = closeCheckoutModal;
window.calculateCheckoutBill = calculateCheckoutBill;
window.handlePaymentSubmit = handlePaymentSubmit;
window.selectAdminShelter = selectAdminShelter;
window.handleCategoryChange = handleCategoryChange;
window.handleItemChange = handleItemChange;
window.setCauseFilter = setCauseFilter;
window.renderDonationHistory = renderDonationHistory;
window.goToDonationHistory = goToDonationHistory;
window.openDonationDetailsModal = openDonationDetailsModal;
window.closeDonationDetailsModal = closeDonationDetailsModal;
window.toggleSidebar = toggleSidebar;
window.toggleTheme = toggleTheme;
window.openAddNeedModal = openAddNeedModal;
window.closeAddNeedModal = closeAddNeedModal;
window.toggleExpandNeedsDrawer = toggleExpandNeedsDrawer;
window.runMcpSimulation = runMcpSimulation;
window.clearMcpTerminal = clearMcpTerminal;
window.setMcpPrompt = setMcpPrompt;
window.downloadMcpLogs = downloadMcpLogs;
window.cancelOrder = cancelOrder;

// ==========================================
// Mock Database Layer
// ==========================================

const SHELTERS_DB = [
  {
    id: "shelter_aasha",
    name: "Aasha Senior Citizen Home",
    type: "Old-Age Home",
    city: "Varanasi, UP",
    address: "B-2/45, Assi Ghat Road, Varanasi, UP - 221005",
    avatar: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=150",
    cover: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800",
    description: "Caring for 45 elderly residents abandoned or without families. We strive to provide a peaceful, dignified life, daily healthcare, and a loving community.",
    swiggyAddressId: "addr_aasha_99",
    needs: [
      { id: "need_aasha_01", name: "Aashirvaad Shudh Chakki Atta 10kg", category: "GROCERY", quantity: 15, pledged: 9, delivered: 4, price: 460, type: "instamart", spinId: "sku_atta_10k" },
      { id: "need_aasha_02", name: "Fortune Mustard Oil 1L", category: "GROCERY", quantity: 20, pledged: 12, delivered: 8, price: 175, type: "instamart", spinId: "sku_oil_1l" },
      { id: "need_aasha_03", name: "Tata Sampann Toor Dal 1kg", category: "GROCERY", quantity: 30, pledged: 15, delivered: 5, price: 190, type: "instamart", spinId: "sku_dal_1k" },
      { id: "need_aasha_04", name: "Gulab Jamun (15 pcs)", category: "SPECIAL MEAL", quantity: 3, pledged: 0, delivered: 0, price: 280, type: "food", isSpecialMeal: true, favoriteFood: "Gulab Jamun Sweet Treat", restaurantId: "rest_bikanervala" }
    ]
  },
  {
    id: "shelter_kalyan",
    name: "Kalyan Children's Orphanage",
    type: "Orphanage",
    city: "Bengaluru, KA",
    address: "42, 3rd Cross, Koramangala 4th Block, Bengaluru, KA - 560034",
    avatar: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=150",
    cover: "https://images.unsplash.com/photo-1489659639091-8b687bc4386e?auto=format&fit=crop&q=80&w=800",
    description: "A shelter home supporting 65 orphaned and vulnerable children. Providing quality education, healthy nutrition, and a vibrant environment to foster their dreams.",
    swiggyAddressId: "addr_kalyan_88",
    needs: [
      { id: "need_kalyan_01", name: "Amul Taaza Fresh Milk 1L Pack", category: "GROCERY", quantity: 40, pledged: 30, delivered: 20, price: 74, type: "instamart", spinId: "sku_milk_1l" },
      { id: "need_kalyan_02", name: "Dettol Liquid Handwash 1.5L Refill", category: "TOILETRIES", quantity: 10, pledged: 3, delivered: 1, price: 219, type: "instamart", spinId: "sku_dettol_1.5" },
      { id: "need_kalyan_03", name: "Paneer Butter Masala & Garlic Naan Combo", category: "SPECIAL MEAL", quantity: 15, pledged: 0, delivered: 0, price: 340, type: "food", isSpecialMeal: true, favoriteFood: "Festive Butter Paneer Feast", restaurantId: "rest_haldiram" },
      { id: "need_kalyan_04", name: "Wooden Ludo & Snakes Board Game", category: "ENTERTAINMENT", quantity: 5, pledged: 2, delivered: 1, price: 299, type: "instamart", spinId: "sku_ludo_board" }
    ]
  },
  {
    id: "shelter_paws",
    name: "Paws & Claws Rescue Home",
    type: "Animal Welfare",
    city: "Mumbai, MH",
    address: "Gala No. 12, Marol Cooperative Industrial Estate, Andheri East, Mumbai - 400059",
    avatar: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=150",
    cover: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800",
    description: "Providing shelter, medical care, and rehabilitation for 80+ rescued stray dogs, cats, and injured birds. Supported purely by community contributions.",
    swiggyAddressId: "addr_paws_77",
    needs: [
      { id: "need_paws_01", name: "Pedigree Chicken & Veg Dog Food 3kg", category: "ANIMAL FOOD", quantity: 25, pledged: 15, delivered: 10, price: 680, type: "instamart", spinId: "sku_pedigree_3k" },
      { id: "need_paws_02", name: "Whiskas Dry Cat Food (Tuna) 1.2kg", category: "ANIMAL FOOD", quantity: 15, pledged: 8, delivered: 4, price: 410, type: "instamart", spinId: "sku_whiskas_1.2" },
      { id: "need_paws_03", name: "Savlons Antiseptic Liquid Soap 500ml", category: "MEDICINE", quantity: 12, pledged: 5, delivered: 2, price: 145, type: "instamart", spinId: "sku_savlon_500" }
    ]
  }
];

// Active Orders/Pledges Queue
let PLEDGES_QUEUE = [
  {
    id: "ord_101",
    shelterId: "shelter_aasha",
    donorName: "Rohan Sharma",
    itemName: "Aashirvaad Shudh Chakki Atta 10kg",
    category: "GROCERY",
    quantity: 3,
    amount: 1380,
    swiggyOrderId: "sw_order_gro_9988",
    status: "delivered", // delivered, in_transit, placed, pledged
    type: "instamart"
  },
  {
    id: "ord_102",
    shelterId: "shelter_kalyan",
    donorName: "Ananya Iyer",
    itemName: "Amul Taaza Fresh Milk 1L Pack",
    category: "GROCERY",
    quantity: 10,
    amount: 740,
    swiggyOrderId: "sw_order_gro_2234",
    status: "in_transit",
    type: "instamart",
    deliveryProgress: 45 // Percentage along the road
  }
];

// ==========================================
// UI / State Variables
// ==========================================

let activeView = "donor"; // donor | admin
let selectedShelter = SHELTERS_DB[0];
let activeCheckoutNeed = null;
let currentTrackingOrder = null;

// ==========================================
// Swiggy MCP Logger Engine
// ==========================================

function logToConsole(type, label, data) {
  const consoleOutput = document.getElementById("console-output");
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
  const consoleOutput = document.getElementById("console-output");
  if (consoleOutput) consoleOutput.innerHTML = "";
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
    amount: need.price * quantity,
    swiggyOrderId: orderConfirmation.orderId,
    status: "placed",
    type: need.type,
    deliveryProgress: 15,
    eta: orderConfirmation.etaMinutes
  };

  PLEDGES_QUEUE.unshift(newOrder);

  // Update original needs tally (mock update database)
  need.pledged += quantity;

  // Refresh UI dashboards
  renderShelters();
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
      order.status = "delivered";
      order.deliveryProgress = 100;
      
      // Update shelter database: confirm delivery received
      const shelter = SHELTERS_DB.find(s => s.id === order.shelterId);
      const need = shelter.needs.find(n => n.name === order.itemName);
      if (need) {
        need.delivered = Math.min(need.quantity, need.delivered + order.quantity);
      }
      
      logToConsole("info", `DELIVERED! Swiggy partner completed drop-off at shelter doorstep. Order ID: ${order.swiggyOrderId}`, null);
      renderShelters();
      renderAdminPanel();
    } else {
      order.status = "in_transit";
      renderAdminPanel();
    }
  }, 10000); // Progress updates every 10 seconds (as recommended by docs to prevent rate limit)
}

// ==========================================
// Rendering Engine - Donor View
// ==========================================

function renderShelters() {
  const grid = document.getElementById("shelter-grid");
  if (!grid) return;

  grid.innerHTML = SHELTERS_DB.map(shelter => {
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
          <h3 class="shelter-title">${shelter.name}</h3>
          <div class="shelter-location">
            <span>📍</span> ${shelter.city}
          </div>
          <p class="shelter-desc">${shelter.description}</p>
          <div class="needs-summary">
            <div class="needs-summary-title">Supplies Needed (${unmetCount})</div>
            <div class="needs-summary-list">
              ${tagHtml}
              ${shelter.needs.length > 3 ? `<span class="need-tag">+${shelter.needs.length - 3} more</span>` : ''}
            </div>
          </div>
          <div class="shelter-card-footer">
            <button class="btn btn-primary" onclick="openNeedsDrawer('${shelter.id}')">
              <span>💝</span> Support Shelter
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
          <span>Pledged: <strong class="progress-pct">${need.pledged}</strong> / ${need.quantity} units</span>
          <span class="progress-pct">${progress}%</span>
        </div>

        ${unmet > 0 ? `
          <button class="btn sponsor-btn" onclick="openCheckoutModal('${need.id}')">
            🤝 Sponsor ${isSpecial ? 'Meal' : 'Supply'}
          </button>
        ` : `
          <button class="btn btn-secondary" style="margin-top: 1rem; cursor: not-allowed;" disabled>
            ✅ Needs Fulfilled
          </button>
        `}
      </div>
    `;
  }).join('');

  document.getElementById("needs-drawer").classList.add("open");
  document.getElementById("drawer-overlay").classList.add("open");
}

function closeNeedsDrawer() {
  document.getElementById("needs-drawer").classList.remove("open");
  document.getElementById("drawer-overlay").classList.remove("open");
}

// ==========================================
// Rendering Engine - Checkout Flow
// ==========================================

function openCheckoutModal(needId) {
  const need = selectedShelter.needs.find(n => n.id === needId);
  activeCheckoutNeed = need;

  document.getElementById("checkout-need-title").innerText = `Sponsor: ${need.name}`;
  document.getElementById("checkout-need-price").innerText = `₹${need.price}`;
  
  // Set default quantity input to match remaining unmet need
  const remaining = need.quantity - need.pledged;
  document.getElementById("checkout-qty").value = 1;
  document.getElementById("checkout-qty").max = remaining;

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
  const qty = parseInt(document.getElementById("checkout-qty").value) || 1;
  const unitPrice = activeCheckoutNeed.price;
  
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
  
  // Fire background Swiggy MCP transaction pipeline
  closeNeedsDrawer();
  
  // Fire automated task
  const newOrder = await triggerSwiggyMcpOrderWorkflow(activeCheckoutNeed, qty, donorName);

  // Update success screen with live order details
  document.getElementById("success-msg").innerHTML = `
    <h4>Fulfillment Logged!</h4>
    <p style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-secondary)">
      Thank you for donating <strong>${qty}x ${activeCheckoutNeed.name}</strong> to ${selectedShelter.name}.
    </p>
    <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem; margin-top: 1rem; font-family: var(--font-mono); font-size: 0.8rem; text-align: left;">
      <div>Swiggy Order: <strong style="color: var(--secondary)">${newOrder.swiggyOrderId}</strong></div>
      <div>Delivery: <span class="badge-status placed" style="padding: 0.1rem 0.4rem; font-size: 0.65rem;">Placed</span></div>
      <div style="margin-top: 0.25rem; font-size: 0.75rem; color: var(--text-secondary)">
        Staging COD financed. Checking out to logged address ID. You can monitor this live on the Admin Dashboard!
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

  // Render Shelter Needs
  activeNeedsGrid.innerHTML = selectedShelter.needs.map(need => {
    const isSpecial = need.isSpecialMeal;
    const progress = Math.round((need.pledged / need.quantity) * 100);

    return `
      <div class="need-list-item" style="margin-bottom: 0.75rem;">
        <div class="need-meta" style="margin-bottom: 0.25rem;">
          <span style="font-weight: 600; font-size: 0.9rem;">${need.name}</span>
          <span class="need-category-badge ${isSpecial ? 'special' : ''}" style="font-size: 0.65rem;">
            ${isSpecial ? 'Special Meal' : need.category}
          </span>
        </div>
        <div class="progress-label" style="font-size: 0.75rem;">
          <span>Goal: ${need.quantity} | Pledged: ${need.pledged} | Delivered: <strong style="color: #10B981;">${need.delivered}</strong></span>
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
          <div class="map-marker shop">🏪</div>
          <div class="map-label shop">Swiggy Hub</div>
          
          <div class="map-bike" style="left: ${bikeOffset}%">🛵</div>
          
          <div class="map-marker shelter">🏡</div>
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
  "ANIMAL FOOD": [
    { name: "Pedigree Dry Dog Food", unitType: "weight" }, // Pets can have bulk weights!
    { name: "Whiskas Wet Cat Food", unitType: "discrete" },
    { name: "Stray Animal Nutrition Biscuits", unitType: "weight" }
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
  
  // Animal Welfare
  if (category === "ANIMAL FOOD") {
    if (size === "10kg") return 1900;
    if (size === "5kg") return 950;
    if (size === "3kg" || size === "1.2kg" || size === "1kg") return 410;
    return 150;
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
  
  logToConsole("info", `Admin added new need: "${name}" | Goal: ${qty} units | Automatic Price Locked: ₹${price} (calculated via catalog size mapping)`, null);

  // Reset form and reinitialize selector
  qtyInput.value = "10";
  catSelect.value = "GROCERY";
  handleCategoryChange();

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

// ==========================================
// Initialization & Tab Controls
// ==========================================

function switchView(view) {
  activeView = view;
  
  // Toggle active views
  document.getElementById("view-btn-donor").classList.toggle("active", view === "donor");
  document.getElementById("view-btn-admin").classList.toggle("active", view === "admin");
  
  document.getElementById("view-donor").classList.toggle("active", view === "donor");
  document.getElementById("view-admin").classList.toggle("active", view === "admin");

  if (view === "admin") {
    // Populate admin sidebar select
    const sidebarList = document.getElementById("admin-shelter-select-list");
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

    renderAdminPanel();
  } else {
    renderShelters();
  }
}

// Global bootstrap loader
window.addEventListener("DOMContentLoaded", () => {
  clearConsole();
  renderShelters();
  
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
          
          const shelter = SHELTERS_DB.find(s => s.id === order.shelterId);
          const need = shelter.needs.find(n => n.name === order.itemName);
          if (need) {
            need.delivered = Math.min(need.quantity, need.delivered + order.quantity);
          }
          logToConsole("info", `DELIVERED! Mock order ${order.swiggyOrderId} successfully completed.`, null);
          renderShelters();
        } else {
          order.status = "in_transit";
        }
      }
    });
    if (activeView === "admin") renderAdminPanel();
  }, 12000);
});

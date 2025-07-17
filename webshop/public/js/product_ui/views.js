webshop.ProductView = class {
	/* Options:
		- View Type
		- Products Section Wrapper,
		- Item Group: If its an Item Group page
	*/
	constructor(options) {
		Object.assign(this, options);
		this.preference = this.view_type;
		this.make();
	}

	make(from_filters=false) {
		this.products_section.empty();
		this.prepare_banner(); // Add banner preparation
		this.prepare_toolbar();
		this.get_item_filter_data(from_filters);
	}

	prepare_banner() {
		// Add banner HTML with 3 sliding images
		this.products_section.append(`
			<div class="banner-container">
				<div class="banner-slider">
					<div class="banner-slide active">
						<img src="/assets/webshop/images/banner1.jpg" alt="Banner 1" class="banner-image">
					</div>
					<div class="banner-slide">
						<img src="/assets/webshop/images/banner1.jpg" alt="Banner 2" class="banner-image">
					</div>
					<div class="banner-slide">
						<img src="/assets/webshop/images/banner1.jpg" alt="Banner 3" class="banner-image">
					</div>
				</div>
				<div class="banner-dots">
					<span class="dot active" data-slide="0"></span>
					<span class="dot" data-slide="1"></span>
					<span class="dot" data-slide="2"></span>
				</div>
				<button class="banner-btn prev-btn">&#10094;</button>
				<button class="banner-btn next-btn">&#10095;</button>
			</div>
		`);

		// Add banner styles
		this.add_banner_styles();
		
		// Initialize banner functionality
		this.init_banner_slider();
	}

	add_banner_styles() {
		if (!document.getElementById('banner-styles')) {
			const style = document.createElement('style');
			style.id = 'banner-styles';
			style.textContent = `
				.banner-container {
					position: relative;
					width: 100%;
					height: 300px;
					margin-bottom: 20px;
					overflow: hidden;
					border-radius: 10px;
					box-shadow: 0 4px 8px rgba(0,0,0,0.1);
				}

				.banner-slider {
					position: relative;
					width: 100%;
					height: 100%;
				}

				.banner-slide {
					position: absolute;
					width: 100%;
					height: 100%;
					opacity: 0;
					transition: opacity 0.5s ease-in-out;
				}

				.banner-slide.active {
					opacity: 1;
				}

				.banner-image {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}

				.banner-btn {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					background: rgba(0,0,0,0.5);
					color: white;
					border: none;
					padding: 10px 15px;
					cursor: pointer;
					font-size: 18px;
					border-radius: 5px;
					transition: background 0.3s ease;
				}

				.banner-btn:hover {
					background: rgba(0,0,0,0.7);
				}

				.prev-btn {
					left: 10px;
				}

				.next-btn {
					right: 10px;
				}

				.banner-dots {
					position: absolute;
					bottom: 20px;
					left: 50%;
					transform: translateX(-50%);
					display: flex;
					gap: 10px;
				}

				.dot {
					width: 12px;
					height: 12px;
					border-radius: 50%;
					background: rgba(255,255,255,0.5);
					cursor: pointer;
					transition: background 0.3s ease;
				}

				.dot.active {
					background: white;
				}

				.dot:hover {
					background: rgba(255,255,255,0.8);
				}

				@media (max-width: 768px) {
					.banner-container {
						height: 200px;
					}
					
					.banner-btn {
						padding: 8px 12px;
						font-size: 16px;
					}
				}
			`;
			document.head.appendChild(style);
		}
	}

	init_banner_slider() {
		let currentSlide = 0;
		const slides = document.querySelectorAll('.banner-slide');
		const dots = document.querySelectorAll('.dot');
		const totalSlides = slides.length;

		// Auto-slide functionality
		let slideInterval = setInterval(() => {
			this.next_slide();
		}, 5000);

		// Next slide function
		this.next_slide = () => {
			slides[currentSlide].classList.remove('active');
			dots[currentSlide].classList.remove('active');
			currentSlide = (currentSlide + 1) % totalSlides;
			slides[currentSlide].classList.add('active');
			dots[currentSlide].classList.add('active');
		};

		// Previous slide function
		this.prev_slide = () => {
			slides[currentSlide].classList.remove('active');
			dots[currentSlide].classList.remove('active');
			currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
			slides[currentSlide].classList.add('active');
			dots[currentSlide].classList.add('active');
		};

		// Go to specific slide
		this.go_to_slide = (index) => {
			slides[currentSlide].classList.remove('active');
			dots[currentSlide].classList.remove('active');
			currentSlide = index;
			slides[currentSlide].classList.add('active');
			dots[currentSlide].classList.add('active');
		};

		// Event listeners
		document.querySelector('.next-btn').addEventListener('click', () => {
			clearInterval(slideInterval);
			this.next_slide();
			slideInterval = setInterval(() => this.next_slide(), 5000);
		});

		document.querySelector('.prev-btn').addEventListener('click', () => {
			clearInterval(slideInterval);
			this.prev_slide();
			slideInterval = setInterval(() => this.next_slide(), 5000);
		});

		// Dot navigation
		dots.forEach((dot, index) => {
			dot.addEventListener('click', () => {
				clearInterval(slideInterval);
				this.go_to_slide(index);
				slideInterval = setInterval(() => this.next_slide(), 5000);
			});
		});

		// Pause on hover
		const bannerContainer = document.querySelector('.banner-container');
		bannerContainer.addEventListener('mouseenter', () => {
			clearInterval(slideInterval);
		});

		bannerContainer.addEventListener('mouseleave', () => {
			slideInterval = setInterval(() => this.next_slide(), 5000);
		});
	}

	prepare_toolbar() {
		this.products_section.append(`
			<div class="toolbar d-flex">
			</div>
		`);
		this.prepare_filter_button();
		this.prepare_search();
		this.prepare_view_toggler();

		new webshop.ProductSearch();
	}

	prepare_filter_button() {
		$(".toolbar").append(`
			<div class="filter-button-container col-2 p-0">
				<button id="filter-toggle-btn" class="btn btn-outline-primary filter-toggle-btn">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
					</svg>
					<span class="ml-2">Filters</span>
				</button>
			</div>
		`);
		this.bind_filter_toggle();
	}

	bind_filter_toggle() {
		$('#filter-toggle-btn').click(() => {
			const filterPanel = $('#filter-panel');
			const overlay = $('#filter-overlay');
			
			if (filterPanel.length) {
				// If panel exists, toggle it
				if (filterPanel.hasClass('show')) {
					filterPanel.removeClass('show');
					overlay.removeClass('show');
					setTimeout(() => {
						filterPanel.remove();
						overlay.remove();
					}, 300);
				}
			} else {
				// Create and show filter panel
				this.create_filter_panel();
			}
		});
	}

	create_filter_panel() {
		// Create overlay
		$('body').append(`
			<div id="filter-overlay" class="filter-overlay"></div>
		`);

		// Create filter panel
		$('body').append(`
			<div id="filter-panel" class="filter-panel">
				<div class="filter-header">
					<h4>Filters</h4>
					<button id="close-filter-btn" class="close-btn">×</button>
				</div>
				<div class="filter-content">
					<div id="mobile-filters-container">
						<!-- Filters will be loaded here -->
					</div>
				</div>
				<div class="filter-footer">
					<button id="clear-filters-btn" class="btn btn-outline-secondary">Clear All</button>
					<button id="apply-filters-btn" class="btn btn-primary">Apply Filters</button>
				</div>
			</div>
		`);

		// Add filter panel styles
		this.add_filter_panel_styles();

		// Load filters into panel
		this.load_filters_into_panel();

		// Show panel with animation
		setTimeout(() => {
			$('#filter-panel').addClass('show');
			$('#filter-overlay').addClass('show');
		}, 10);

		// Bind close events
		$('#close-filter-btn, #filter-overlay').click(() => {
			$('#filter-panel').removeClass('show');
			$('#filter-overlay').removeClass('show');
			setTimeout(() => {
				$('#filter-panel').remove();
				$('#filter-overlay').remove();
			}, 300);
		});

		// Bind footer buttons
		$('#clear-filters-btn').click(() => {
			this.clear_all_filters();
		});

		$('#apply-filters-btn').click(() => {
			$('#filter-panel').removeClass('show');
			$('#filter-overlay').removeClass('show');
			setTimeout(() => {
				$('#filter-panel').remove();
				$('#filter-overlay').remove();
			}, 300);
		});
	}

	add_filter_panel_styles() {
		if (!document.getElementById('filter-panel-styles')) {
			const style = document.createElement('style');
			style.id = 'filter-panel-styles';
			style.textContent = `
				.filter-button-container {
					display: flex;
					align-items: center;
				}

				.filter-toggle-btn {
					display: flex;
					align-items: center;
					border: 1px solid #ddd;
					background: white;
					padding: 8px 16px;
					border-radius: 4px;
					font-size: 14px;
					transition: all 0.3s ease;
				}

				.filter-toggle-btn:hover {
					background: #f8f9fa;
					border-color: #007bff;
				}

				.filter-overlay {
					position: fixed;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: rgba(0, 0, 0, 0.5);
					z-index: 1000;
					opacity: 0;
					visibility: hidden;
					transition: all 0.3s ease;
				}

				.filter-overlay.show {
					opacity: 1;
					visibility: visible;
				}

				.filter-panel {
					position: fixed;
					top: 0;
					right: -400px;
					width: 400px;
					height: 100%;
					background: white;
					z-index: 1001;
					display: flex;
					flex-direction: column;
					transition: right 0.3s ease;
					box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
				}

				.filter-panel.show {
					right: 0;
				}

				.filter-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 20px;
					border-bottom: 1px solid #eee;
					background: #f8f9fa;
				}

				.filter-header h4 {
					margin: 0;
					font-size: 18px;
					font-weight: 600;
				}

				.close-btn {
					background: none;
					border: none;
					font-size: 24px;
					cursor: pointer;
					color: #666;
					width: 30px;
					height: 30px;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;
					transition: all 0.3s ease;
				}

				.close-btn:hover {
					background: #e9ecef;
					color: #333;
				}

				.filter-content {
					flex: 1;
					overflow-y: auto;
					padding: 20px;
				}

				.filter-footer {
					display: flex;
					gap: 10px;
					padding: 20px;
					border-top: 1px solid #eee;
					background: #f8f9fa;
				}

				.filter-footer .btn {
					flex: 1;
					padding: 10px;
					border-radius: 4px;
					font-weight: 500;
				}

				.filter-section {
					margin-bottom: 25px;
					padding-bottom: 20px;
					border-bottom: 1px solid #eee;
				}

				.filter-section:last-child {
					border-bottom: none;
				}

				.filter-section h5 {
					font-size: 16px;
					font-weight: 600;
					margin-bottom: 15px;
					color: #333;
				}

				.filter-option {
					display: flex;
					align-items: center;
					padding: 8px 0;
					cursor: pointer;
					transition: background 0.2s ease;
				}

				.filter-option:hover {
					background: #f8f9fa;
					border-radius: 4px;
					padding-left: 5px;
				}

				.filter-option input[type="checkbox"],
				.filter-option input[type="radio"] {
					margin-right: 10px;
					transform: scale(1.1);
				}

				.filter-option label {
					cursor: pointer;
					margin: 0;
					font-size: 14px;
					color: #555;
				}

				@media (max-width: 768px) {
					.filter-panel {
						width: 100%;
						right: -100%;
					}
				}

				/* Hide default filters from main page */
				#product-filters {
					display: none !important;
				}

				/* Adjust search box width */
				.toolbar .input-group {
					width: 60% !important;
				}
			`;
			document.head.appendChild(style);
		}
	}

	// Enhanced load_filters_into_panel method
load_filters_into_panel() {
	// Wait for filters to be loaded from the main page
	setTimeout(() => {
		const originalFilters = $('#product-filters');
		if (originalFilters.length) {
			// Copy the entire structure including title and clear all
			const filtersContainer = originalFilters.clone();
			
			// Update the structure for mobile panel
			filtersContainer.removeClass('collapse d-md-block mr-4 filters-section');
			filtersContainer.addClass('mobile-filters-container');
			
			// Update the title section for mobile
			const titleSection = filtersContainer.find('.title-section');
			if (titleSection.length) {
				titleSection.find('.clear-filters').attr('href', '#').addClass('mobile-clear-all');
			}
			
			// Add the cloned filters to mobile panel
			$('#mobile-filters-container').html(filtersContainer.html());
			
			// Enhance the mobile layout
			this.enhance_mobile_filter_layout();
			
			// Re-bind filter events for mobile panel
			this.bind_mobile_filter_events();
		}
	}, 1000);
}

// New method to enhance mobile filter layout
enhance_mobile_filter_layout() {
	// Style the title section for mobile
	$('#mobile-filters-container .title-section').css({
		'border-bottom': '1px solid #eee',
		'padding-bottom': '15px',
		'margin-bottom': '20px'
	});
	
	// Style each filter block
	$('#mobile-filters-container .filter-block').each(function() {
		const $block = $(this);
		$block.addClass('mobile-filter-block');
		
		// Style filter labels
		$block.find('.filter-label').css({
			'font-weight': '600',
			'margin-bottom': '10px',
			'color': '#333'
		});
		
		// Style filter options
		$block.find('.filter-options').addClass('mobile-filter-options');
		
		// Style checkboxes and labels
		$block.find('.checkbox').each(function() {
			$(this).addClass('mobile-filter-option');
		});
	});
	
	// Bind mobile clear all action
	$('.mobile-clear-all').off('click').on('click', (e) => {
		e.preventDefault();
		this.clear_all_filters();
	});
}

// Enhanced mobile filter styles
add_filter_panel_styles() {
	if (!document.getElementById('filter-panel-styles')) {
		const style = document.createElement('style');
		style.id = 'filter-panel-styles';
		style.textContent = `
			.filter-button-container {
				display: flex;
				align-items: center;
			}

			.filter-toggle-btn {
				display: flex;
				align-items: center;
				border: 1px solid #ddd;
				background: white;
				padding: 8px 16px;
				border-radius: 4px;
				font-size: 14px;
				transition: all 0.3s ease;
			}

			.filter-toggle-btn:hover {
				background: #f8f9fa;
				border-color: #007bff;
			}

			.filter-overlay {
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: rgba(0, 0, 0, 0.5);
				z-index: 1000;
				opacity: 0;
				visibility: hidden;
				transition: all 0.3s ease;
			}

			.filter-overlay.show {
				opacity: 1;
				visibility: visible;
			}

			.filter-panel {
				position: fixed;
				top: 0;
				right: -400px;
				width: 400px;
				height: 100%;
				background: white;
				z-index: 1001;
				display: flex;
				flex-direction: column;
				transition: right 0.3s ease;
				box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
			}

			.filter-panel.show {
				right: 0;
			}

			.filter-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 20px;
				border-bottom: 1px solid #eee;
				background: #f8f9fa;
			}

			.filter-header h4 {
				margin: 0;
				font-size: 18px;
				font-weight: 600;
			}

			.close-btn {
				background: none;
				border: none;
				font-size: 24px;
				cursor: pointer;
				color: #666;
				width: 30px;
				height: 30px;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				transition: all 0.3s ease;
			}

			.close-btn:hover {
				background: #e9ecef;
				color: #333;
			}

			.filter-content {
				flex: 1;
				overflow-y: auto;
				padding: 20px;
			}

			.filter-footer {
				display: flex;
				gap: 10px;
				padding: 20px;
				border-top: 1px solid #eee;
				background: #f8f9fa;
			}

			.filter-footer .btn {
				flex: 1;
				padding: 10px;
				border-radius: 4px;
				font-weight: 500;
			}

			/* Mobile Filter Specific Styles */
			.mobile-filters-container {
				width: 100%;
			}

			.mobile-filters-container .title-section {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20px;
				padding-bottom: 15px;
				border-bottom: 1px solid #eee;
			}

			.mobile-filters-container .filters-title {
				font-size: 18px;
				font-weight: 600;
				color: #333;
				margin: 0;
			}

			.mobile-filters-container .clear-filters {
				color: #007bff;
				text-decoration: none;
				font-size: 14px;
				font-weight: 500;
			}

			.mobile-filters-container .clear-filters:hover {
				text-decoration: underline;
			}

			.mobile-filter-block {
				margin-bottom: 25px;
				padding-bottom: 20px;
				border-bottom: 1px solid #eee;
			}

			.mobile-filter-block:last-child {
				border-bottom: none;
			}

			.mobile-filter-block .filter-label {
				font-size: 16px;
				font-weight: 600;
				margin-bottom: 15px;
				color: #333;
			}

			.mobile-filter-options {
				display: flex;
				flex-direction: column;
				gap: 5px;
			}

			.mobile-filter-option {
				display: flex;
				align-items: center;
				padding: 8px 0;
				cursor: pointer;
				transition: background 0.2s ease;
			}

			.mobile-filter-option:hover {
				background: #f8f9fa;
				border-radius: 4px;
				padding-left: 5px;
			}

			.mobile-filter-option input[type="checkbox"],
			.mobile-filter-option input[type="radio"] {
				margin-right: 10px;
				transform: scale(1.1);
			}

			.mobile-filter-option label {
				cursor: pointer;
				margin: 0;
				font-size: 14px;
				color: #555;
				width: 100%;
				display: flex;
				align-items: center;
			}

			.mobile-filter-option .label-area {
				margin-left: 5px;
			}

			@media (max-width: 768px) {
				.filter-panel {
					width: 100%;
					right: -100%;
				}
			}

			/* Hide default filters from main page */
			#product-filters {
				display: none !important;
			}

			/* Adjust search box width */
			.toolbar .input-group {
				width: 60% !important;
			}
		`;
		document.head.appendChild(style);
	}
}

// Enhanced clear all filters method
clear_all_filters() {
	// Clear all filter states
	this.field_filters = {};
	this.attribute_filters = {};
	
	// Uncheck all checkboxes in mobile panel
	$('#mobile-filters-container input[type="checkbox"], #mobile-filters-container input[type="radio"]').prop('checked', false);
	
	// Apply the cleared filters
	this.change_route_with_filters();
	
	// Close the filter panel
	$('#filter-panel').removeClass('show');
	$('#filter-overlay').removeClass('show');
	setTimeout(() => {
		$('#filter-panel').remove();
		$('#filter-overlay').remove();
	}, 300);
}
	bind_mobile_filter_events() {
		const me = this;
		
		$('#mobile-filters-container .product-filter').off('change').on('change', (e) => {
			me.from_filters = true;

			const $checkbox = $(e.target);
			const is_checked = $checkbox.is(':checked');

			if ($checkbox.is('.attribute-filter')) {
				const {
					attributeName: attribute_name,
					attributeValue: attribute_value
				} = $checkbox.data();

				if (is_checked) {
					me.attribute_filters[attribute_name] = me.attribute_filters[attribute_name] || [];
					me.attribute_filters[attribute_name].push(attribute_value);
				} else {
					me.attribute_filters[attribute_name] = me.attribute_filters[attribute_name] || [];
					me.attribute_filters[attribute_name] = me.attribute_filters[attribute_name].filter(v => v !== attribute_value);
				}

				if (me.attribute_filters[attribute_name].length === 0) {
					delete me.attribute_filters[attribute_name];
				}
			} else if ($checkbox.is('.field-filter') || $checkbox.is('.discount-filter')) {
				const {
					filterName: filter_name,
					filterValue: filter_value
				} = $checkbox.data();

				if ($checkbox.is('.discount-filter')) {
					delete me.field_filters["discount"];
				}
				
				if (is_checked) {
					me.field_filters[filter_name] = me.field_filters[filter_name] || [];
					if (!me.field_filters[filter_name].includes(filter_value)) {
						me.field_filters[filter_name].push(filter_value);
					}
				} else {
					me.field_filters[filter_name] = me.field_filters[filter_name] || [];
					me.field_filters[filter_name] = me.field_filters[filter_name].filter(v => v !== filter_value);
				}

				if (me.field_filters[filter_name].length === 0) {
					delete me.field_filters[filter_name];
				}
			}

			// Apply filters immediately
			me.change_route_with_filters();
		});
	}

	clear_all_filters() {
		// Clear all filter states
		this.field_filters = {};
		this.attribute_filters = {};
		
		// Uncheck all checkboxes in mobile panel
		$('#mobile-filters-container input[type="checkbox"], #mobile-filters-container input[type="radio"]').prop('checked', false);
		
		// Apply the cleared filters
		this.change_route_with_filters();
	}

	prepare_view_toggler() {

		if (!$("#list").length || !$("#image-view").length) {
			this.render_view_toggler();
			this.bind_view_toggler_actions();
			this.set_view_state();
		}
	}

	get_item_filter_data(from_filters=false) {
		// Get and render all Product related views
		let me = this;
		this.from_filters = from_filters;
		let args = this.get_query_filters();

		this.disable_view_toggler(true);

		frappe.call({
			method: "webshop.webshop.api.get_product_filter_data",
			args: {
				query_args: args
			},
			callback: function(result) {
				if (!result || result.exc || !result.message || result.message.exc) {
					me.render_no_products_section(true);
				} else {
					// Sub Category results are independent of Items
					if (me.item_group && result.message["sub_categories"].length) {
						me.render_item_sub_categories(result.message["sub_categories"]);
					}

					if (!result.message["items"].length) {
						// if result has no items or result is empty
						me.render_no_products_section();
					} else {
						// Add discount filters
						me.re_render_discount_filters(result.message["filters"].discount_filters);

						// Render views
						me.render_list_view(result.message["items"], result.message["settings"]);
						me.render_grid_view(result.message["items"], result.message["settings"]);

						me.products = result.message["items"];
						me.product_count = result.message["items_count"];
					}

					// Bind filter actions
					if (!from_filters) {
						// If `get_product_filter_data` was triggered after checking a filter,
						// don't touch filters unnecessarily, only data must change
						// filter persistence is handle on filter change event
						me.bind_filters();
						me.restore_filters_state();
					}

					// Bottom paging
					me.add_paging_section(result.message["settings"]);
				}

				me.disable_view_toggler(false);
			}
		});
	}

	disable_view_toggler(disable=false) {
		$('#list').prop('disabled', disable);
		$('#image-view').prop('disabled', disable);
	}

	render_grid_view(items, settings) {
		// loop over data and add grid html to it
		let me = this;
		this.prepare_product_area_wrapper("grid");

		new webshop.ProductGrid({
			items: items,
			products_section: $("#products-grid-area"),
			settings: settings,
			preference: me.preference
		});
	}

	render_list_view(items, settings) {
		let me = this;
		this.prepare_product_area_wrapper("list");

		new webshop.ProductList({
			items: items,
			products_section: $("#products-list-area"),
			settings: settings,
			preference: me.preference
		});
	}

	prepare_product_area_wrapper(view) {
		let left_margin = view == "list" ? "ml-2" : "";
		let top_margin = view == "list" ? "mt-6" : "mt-minus-1";
		return this.products_section.append(`
			<br>
			<div id="products-${view}-area" class="row products-list ${ top_margin } ${ left_margin }" itemscope itemtype="https://schema.org/Product"></div>
		`);
	}

	get_query_filters() {
		const filters = frappe.utils.get_query_params();
		let {field_filters, attribute_filters} = filters;

		field_filters = field_filters ? JSON.parse(field_filters) : {};
		attribute_filters = attribute_filters ? JSON.parse(attribute_filters) : {};

		return {
			field_filters: field_filters,
			attribute_filters: attribute_filters,
			item_group: this.item_group,
			start: filters.start || null,
			from_filters: this.from_filters || false
		};
	}

	add_paging_section(settings) {
		$(".product-paging-area").remove();

		if (this.products) {
			let paging_html = `
				<div class="row product-paging-area mt-5">
					<div class="col-3">
					</div>
					<div class="col-9 text-right">
			`;
			let query_params = frappe.utils.get_query_params();
			let start = query_params.start ? cint(JSON.parse(query_params.start)) : 0;
			let page_length = settings.products_per_page || 0;

			let prev_disable = start > 0 ? "" : "disabled";
			let next_disable = (this.product_count > page_length) ? "" : "disabled";

			paging_html += `
				<button class="btn btn-default btn-prev" data-start="${ start - page_length }"
					style="float: left" ${prev_disable}>
					${ __("Prev") }
				</button>`;

			paging_html += `
				<button class="btn btn-default btn-next" data-start="${ start + page_length }"
					${next_disable}>
					${ __("Next") }
				</button>
			`;

			paging_html += `</div></div>`;

			$(".page_content").append(paging_html);
			this.bind_paging_action();
		}
	}

	prepare_search() {
		$(".toolbar").append(`
			<div class="input-group col-6 p-0">
				<div class="dropdown w-100" id="dropdownMenuSearch">
					<input type="search" name="query" id="search-box" class="form-control font-md"
						placeholder="${__("Search for Products")}"
						aria-label="Product" aria-describedby="button-addon2">
					<div class="search-icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor" stroke-width="2" stroke-linecap="round"
							stroke-linejoin="round"
							class="feather feather-search">
							<circle cx="11" cy="11" r="8"></circle>
							<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
						</svg>
					</div>
					<!-- Results dropdown rendered in product_search.js -->
				</div>
			</div>
		`);
	}

	render_view_toggler() {
		$(".toolbar").append(`<div class="toggle-container col-4 p-0"></div>`);

		["btn-list-view", "btn-grid-view"].forEach(view => {
			let icon = view === "btn-list-view" ? "list" : "image-view";
			$(".toggle-container").append(`
				<div class="form-group mb-0" id="toggle-view">
					<button id="${ icon }" class="btn ${ view } mr-2">
						<span>
							<svg class="icon icon-md">
								<use href="#icon-${ icon }"></use>
							</svg>
						</span>
					</button>
				</div>
			`);
		});
	}

	bind_view_toggler_actions() {
		$("#list").click(function() {
			let $btn = $(this);
			$btn.removeClass('btn-primary');
			$btn.addClass('btn-primary');
			$(".btn-grid-view").removeClass('btn-primary');

			$("#products-grid-area").addClass("hidden");
			$("#products-list-area").removeClass("hidden");
			localStorage.setItem("product_view", "List View");
		});

		$("#image-view").click(function() {
			let $btn = $(this);
			$btn.removeClass('btn-primary');
			$btn.addClass('btn-primary');
			$(".btn-list-view").removeClass('btn-primary');

			$("#products-list-area").addClass("hidden");
			$("#products-grid-area").removeClass("hidden");
			localStorage.setItem("product_view", "Grid View");
		});
	}

	set_view_state() {
		if (this.preference === "List View") {
			$("#list").addClass('btn-primary');
			$("#image-view").removeClass('btn-primary');
		} else {
			$("#image-view").addClass('btn-primary');
			$("#list").removeClass('btn-primary');
		}
	}

	bind_paging_action() {
		let me = this;
		$('.btn-prev, .btn-next').click((e) => {
			const $btn = $(e.target);
			me.from_filters = false;

			$btn.prop('disabled', true);
			const start = $btn.data('start');

			let query_params = frappe.utils.get_query_params();
			query_params.start = start;
			let path = window.location.pathname + '?' + frappe.utils.get_url_from_dict(query_params);
			window.location.href = path;
		});
	}

	re_render_discount_filters(filter_data) {
		this.get_discount_filter_html(filter_data);
		if (this.from_filters) {
			// Bind filter action if triggered via filters
			// if not from filter action, page load will bind actions
			this.bind_discount_filter_action();
		}
		// discount filters are rendered with Items (later)
		// unlike the other filters
		this.restore_discount_filter();
	}

	get_discount_filter_html(filter_data) {
		$("#discount-filters").remove();
		if (filter_data) {
			$("#product-filters").append(`
				<div id="discount-filters" class="mb-4 filter-block pb-5">
					<div class="filter-label mb-3">${ __("Discounts") }</div>
				</div>
			`);

			let html = `<div class="filter-options">`;
			filter_data.forEach(filter => {
				html += `
					<div class="checkbox">
						<label data-value="${ filter[0] }">
							<input type="radio"
								class="product-filter discount-filter"
								name="discount" id="${ filter[0] }"
								data-filter-name="discount"
								data-filter-value="${ filter[0] }"
								style="width: 14px !important"
							>
								<span class="label-area" for="${ filter[0] }">
									${ filter[1] }
								</span>
						</label>
					</div>
				`;
			});
			html += `</div>`;

			$("#discount-filters").append(html);
		}
	}

	restore_discount_filter() {
		const filters = frappe.utils.get_query_params();
		let field_filters = filters.field_filters;
		if (!field_filters) return;

		field_filters = JSON.parse(field_filters);

		if (field_filters && field_filters["discount"]) {
			const values = field_filters["discount"];
			const selector = values.map(value => {
				return `input[data-filter-name="discount"][data-filter-value="${value}"]`;
			}).join(',');
			$(selector).prop('checked', true);
			this.field_filters = field_filters;
		}
	}

	bind_discount_filter_action() {
		let me = this;
		$('.discount-filter').on('change', (e) => {
			const $checkbox = $(e.target);
			const is_checked = $checkbox.is(':checked');

			const {
				filterValue: filter_value
			} = $checkbox.data();

			delete this.field_filters["discount"];

			if (is_checked) {
				this.field_filters["discount"] = [];
				this.field_filters["discount"].push(filter_value);
			}

			if (this.field_filters["discount"].length === 0) {
				delete this.field_filters["discount"];
			}

			me.change_route_with_filters();
		});
	}

	bind_filters() {
		let me = this;
		this.field_filters = {};
		this.attribute_filters = {};

		// Only bind if not already bound for mobile
		if (!this.mobile_filters_bound) {
			$('.product-filter').on('change', (e) => {
				me.from_filters = true;

				const $checkbox = $(e.target);
				const is_checked = $checkbox.is(':checked');

				if ($checkbox.is('.attribute-filter')) {
					const {
						attributeName: attribute_name,
						attributeValue: attribute_value
					} = $checkbox.data();

					if (is_checked) {
						this.attribute_filters[attribute_name] = this.attribute_filters[attribute_name] || [];
						this.attribute_filters[attribute_name].push(attribute_value);
					} else {
						this.attribute_filters[attribute_name] = this.attribute_filters[attribute_name] || [];
						this.attribute_filters[attribute_name] = this.attribute_filters[attribute_name].filter(v => v !== attribute_value);
					}

					if (this.attribute_filters[attribute_name].length === 0) {
						delete this.attribute_filters[attribute_name];
					}
				} else if ($checkbox.is('.field-filter') || $checkbox.is('.discount-filter')) {
					const {
						filterName: filter_name,
						filterValue: filter_value
					} = $checkbox.data();

					if ($checkbox.is('.discount-filter')) {
						// clear previous discount filter to accomodate new
						delete this.field_filters["discount"];
					}
					if (is_checked) {
						this.field_filters[filter_name] = this.field_filters[filter_name] || [];
						if (!in_list(this.field_filters[filter_name], filter_value)) {
							this.field_filters[filter_name].push(filter_value);
						}
					} else {
						this.field_filters[filter_name] = this.field_filters[filter_name] || [];
						this.field_filters[filter_name] = this.field_filters[filter_name].filter(v => v !== filter_value);
					}

					if (this.field_filters[filter_name].length === 0) {
						delete this.field_filters[filter_name];
					}
				}

				me.change_route_with_filters();
			});
		}

		// bind filter lookup input box
		$('.filter-lookup-input').on('keydown', frappe.utils.debounce((e) => {
			const $input = $(e.target);
			const keyword = ($input.val() || '').toLowerCase();
			const $filter_options = $input.next('.filter-options');

			$filter_options.find('.filter-lookup-wrapper').show();
			$filter_options.find('.filter-lookup-wrapper').each((i, el) => {
				const $el = $(el);
				const value = $el.data('value').toLowerCase();
				if (!value.includes(keyword)) {
					$el.hide();
				}
			});
		}, 300));
	}

	change_route_with_filters() {
		let route_params = frappe.utils.get_query_params();

		let start = this.if_key_exists(route_params.start) || 0;
		if (this.from_filters) {
			start = 0; // show items from first page if new filters are triggered
		}

		const query_string = this.get_query_string({
			start: start,
			field_filters: JSON.stringify(this.if_key_exists(this.field_filters)),
			attribute_filters: JSON.stringify(this.if_key_exists(this.attribute_filters)),
		});
		window.history.pushState('filters', '', `${location.pathname}?` + query_string);

		$('.page_content input').prop('disabled', true);

		this.make(true);
		$('.page_content input').prop('disabled', false);
	}

	restore_filters_state() {
		const filters = frappe.utils.get_query_params();
		let {field_filters, attribute_filters} = filters;

		if (field_filters) {
			field_filters = JSON.parse(field_filters);
			for (let fieldname in field_filters) {
				const values = field_filters[fieldname];
				const selector = values.map(value => {
					return `input[data-filter-name="${fieldname}"][data-filter-value="${value}"]`;
				}).join(',');
				$(selector).prop('checked', true);
			}
			this.field_filters = field_filters;
		}
		if (attribute_filters) {
			attribute_filters = JSON.parse(attribute_filters);
			for (let attribute in attribute_filters) {
				const values = attribute_filters[attribute];
				const selector = values.map(value => {
					return `input[data-attribute-name="${attribute}"][data-attribute-value="${value}"]`;
				}).join(',');
				$(selector).prop('checked', true);
			}
			this.attribute_filters = attribute_filters;
		}
	}

	render_no_products_section(error=false) {
		let error_section = `
			<div class="mt-4 w-100 alert alert-error font-md">
				${ __("Something went wrong. Please refresh or contact us.") }
			</div>
		`;
		let no_results_section = `
			<div class="cart-empty frappe-card mt-4">
				<div class="cart-empty-state">
					<img src="/assets/webshop/images/cart-empty-state.png" alt="Empty Cart">
				</div>
				<div class="cart-empty-message mt-4">${ __("No products found") }</p>
			</div>
		`;

		this.products_section.append(error ? error_section : no_results_section);
	}

	render_item_sub_categories(categories) {
		if (categories && categories.length) {
			let sub_group_html = `
				<div class="sub-category-container scroll-categories">
			`;

			categories.forEach(category => {
				sub_group_html += `
					<a href="/${ category.route || '#' }" style="text-decoration: none;">
						<div class="category-pill">
							${ category.name }
						</div>
					</a>
				`;
			});
			sub_group_html += `</div>`;

			$("#product-listing").prepend(sub_group_html);
		}
	}

	get_query_string(object) {
		const url = new URLSearchParams();
		for (let key in object) {
			const value = object[key];
			if (value) {
				url.append(key, value);
			}
		}
		return url.toString();
	}

	if_key_exists(obj) {
		let exists = false;
		for (let key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key]) {
				exists = true;
				break;
			}
		}
		return exists ? obj : undefined;
	}
};
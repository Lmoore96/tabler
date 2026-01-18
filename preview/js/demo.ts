// Setting items
interface SettingItem {
	localStorage: string
	default: string
}

interface SettingsItems {
	[key: string]: SettingItem
}

const items: SettingsItems = {
	"menu-position": { localStorage: "tablerMenuPosition", default: "top" },
	"menu-behavior": { localStorage: "tablerMenuBehavior", default: "sticky" },
	"container-layout": {
		localStorage: "tablerContainerLayout",
		default: "boxed",
	},
}

// Theme config
const config: Record<string, string> = {}
for (const [key, params] of Object.entries(items)) {
	const lsParams = localStorage.getItem(params.localStorage)
	config[key] = lsParams ? lsParams : params.default
}

// Parse url params
const parseUrl = (): void => {
	const search = window.location.search.substring(1)
	const params = search.split("&")

	for (let i = 0; i < params.length; i++) {
		const arr = params[i].split("=")
		const key = arr[0]
		const value = arr[1]

		if (!!items[key]) {
			// Save to localStorage
			localStorage.setItem(items[key].localStorage, value)

			// Update local variables
			config[key] = value
		}
	}
}

// Toggle form controls
const toggleFormControls = (form: HTMLFormElement): void => {
	for (const [key, params] of Object.entries(items)) {
		const elem = form.querySelector(
			`[name="settings-${key}"][value="${config[key]}"]`,
		) as HTMLInputElement | null

		if (elem) {
			elem.checked = true
		}
	}
}

// Submit form
const submitForm = (form: HTMLFormElement): void => {
	// Save data to localStorage
	for (const [key, params] of Object.entries(items)) {
		// Save to localStorage
		const checkedInput = form.querySelector(`[name="settings-${key}"]:checked`) as HTMLInputElement
		if (checkedInput) {
			const value = checkedInput.value
			localStorage.setItem(params.localStorage, value)

			// Update local variables
			config[key] = value
		}
	}

	window.dispatchEvent(new Event("resize"))

	// Bootstrap is available globally
	const bootstrap = (window as any).bootstrap
	if (bootstrap) {
		new bootstrap.Offcanvas(form).hide()
	}
}

// Parse url
parseUrl()

// Elements
const form = document.querySelector("#offcanvas-settings") as HTMLFormElement | null

// Toggle form controls
if (form) {
	form.addEventListener("submit", function (e) {
		e.preventDefault()

		submitForm(form)
	})

	toggleFormControls(form)
}

// Handle "New view" button click
const newViewButton = document.querySelector("#btn-new-view") as HTMLAnchorElement | null
if (newViewButton) {
	newViewButton.addEventListener("click", function (e) {
		e.preventDefault()
		// This is a demo button - you can add custom functionality here
		// For now, it just prevents the default action (scrolling to top)
	})
}

// Studio Dashboard Functions
interface Student {
	id: number
	name: string
	email: string
	phone: string
	lessonPlan: string
	monthlyPayment: number
	status: string
	teacher: string
	teacherPercentage: number
}

interface Teacher {
	id: number
	name: string
	email: string
	phone: string
	specialty: string
	studentCount: number
	percentage: number
}

// Load and display student data
async function loadStudioData(): Promise<void> {
	try {
		// TODO: Replace with actual API call when database is connected
		// For now, using mock data structure
		const students: Student[] = [
			{
				id: 1,
				name: "John Doe",
				email: "john.doe@example.com",
				phone: "(555) 123-4567",
				lessonPlan: "Piano - Beginner",
				monthlyPayment: 200,
				status: "active",
				teacher: "Jane Smith",
				teacherPercentage: 60
			},
			{
				id: 2,
				name: "Sarah Johnson",
				email: "sarah.j@example.com",
				phone: "(555) 234-5678",
				lessonPlan: "Guitar - Intermediate",
				monthlyPayment: 250,
				status: "active",
				teacher: "Mike Davis",
				teacherPercentage: 60
			},
			{
				id: 3,
				name: "Emily Wilson",
				email: "emily.w@example.com",
				phone: "(555) 345-6789",
				lessonPlan: "Voice - Advanced",
				monthlyPayment: 300,
				status: "active",
				teacher: "Jane Smith",
				teacherPercentage: 60
			}
		]

		const teachers: Teacher[] = [
			{
				id: 1,
				name: "Jane Smith",
				email: "jane.smith@example.com",
				phone: "(555) 111-2222",
				specialty: "Piano, Voice",
				studentCount: 2,
				percentage: 60
			},
			{
				id: 2,
				name: "Mike Davis",
				email: "mike.davis@example.com",
				phone: "(555) 333-4444",
				specialty: "Guitar, Bass",
				studentCount: 1,
				percentage: 60
			}
		]

		// Populate student list
		populateStudentList(students)
		
		// Calculate and display income
		calculateIncome(students, teachers)
		
		// Update statistics
		updateStatistics(students, teachers)
	} catch (error) {
		console.error("Error loading studio data:", error)
	}
}

function populateStudentList(students: Student[]): void {
	const tbody = document.querySelector("#students-tbody") as HTMLTableSectionElement | null
	if (!tbody) return

	if (students.length === 0) {
		tbody.innerHTML = `
			<tr>
				<td colspan="7" class="text-center text-secondary">
					<div class="py-3">
						<p>No students yet. Click "Add Student" to get started.</p>
					</div>
				</td>
			</tr>
		`
		return
	}

	tbody.innerHTML = students.map(student => {
		const statusClass = student.status === "active" ? "badge bg-green" : "badge bg-secondary"
		return `
			<tr>
				<td>${student.name}</td>
				<td class="text-secondary"><a href="mailto:${student.email}">${student.email}</a></td>
				<td class="text-secondary">${student.phone}</td>
				<td>${student.lessonPlan}</td>
				<td>$${student.monthlyPayment}</td>
				<td><span class="${statusClass}">${student.status}</span></td>
				<td>
					<a href="#" class="btn btn-sm" data-id="${student.id}">View</a>
				</td>
			</tr>
		`
	}).join("")
}

function calculateIncome(students: Student[], teachers: Teacher[]): void {
	// Calculate total income from students
	const totalStudentIncome = students.reduce((sum, student) => sum + student.monthlyPayment, 0)
	
	// Calculate owner's income (100% - teacher percentage for each student)
	const ownerStudentIncome = students.reduce((sum, student) => {
		const ownerPercentage = (100 - student.teacherPercentage) / 100
		return sum + (student.monthlyPayment * ownerPercentage)
	}, 0)
	
	// Teacher income (what they keep)
	const teacherIncome = totalStudentIncome - ownerStudentIncome
	
	// Total owner income
	const totalIncome = ownerStudentIncome

	// Update DOM
	const studentIncomeEl = document.querySelector("#student-income")
	const teacherIncomeEl = document.querySelector("#teacher-income")
	const totalIncomeEl = document.querySelector("#total-income")

	if (studentIncomeEl) studentIncomeEl.textContent = `$${totalIncome.toFixed(0)}`
	if (teacherIncomeEl) teacherIncomeEl.textContent = `$${teacherIncome.toFixed(0)}`
	if (totalIncomeEl) totalIncomeEl.textContent = totalIncome.toFixed(0)
}

function updateStatistics(students: Student[], teachers: Teacher[]): void {
	const totalStudentsEl = document.querySelector("#total-students")
	const studentsThisMonthEl = document.querySelector("#students-this-month")
	const totalTeachersEl = document.querySelector("#total-teachers")
	const activeTeachersEl = document.querySelector("#active-teachers")

	if (totalStudentsEl) totalStudentsEl.textContent = students.length.toString()
	if (studentsThisMonthEl) studentsThisMonthEl.textContent = students.length.toString() // TODO: Calculate actual this month
	if (totalTeachersEl) totalTeachersEl.textContent = teachers.length.toString()
	if (activeTeachersEl) activeTeachersEl.textContent = teachers.length.toString()
}

// Initialize studio dashboard when DOM is ready
if (document.querySelector("#students-table")) {
	loadStudioData()
}


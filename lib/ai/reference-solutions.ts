
import type { ProblemType } from "./problem-types";

export const REFERENCE_LANGUAGE_ID = 100; // Python 3

type ImplementedProblemType =
  | "longest-subarray-target-sum"
  | "maximum-fixed-window-sum"
  | "minimum-fixed-window-average"
  | "count-close-pairs"
  | "two-sum-sorted"
  | "remove-duplicates-sorted"
  |  "second-largest-element"
  | "rotate-array"
  | "maximum-subarray-sum"
  | "reverse-linked-list"
  | "middle-linked-list"
  | "detect-linked-list-cycle"
  | "valid-parentheses"
  | "next-greater-element"
  | "min-stack"
  | "palindrome-check"
  | "anagram-check"
  | "longest-common-prefix"
  | "binary-search-target"
  | "first-occurrence"
  | "lower-bound"
  | "merge-sorted-arrays"
  | "sort-colors"
  | "merge-sort"
  | "bubble-sort"
  | "selection-sort"
  | "range-sum-query"
  | "equilibrium-index"
  | "range-update-queries"


export const REFERENCE_SOLUTIONS: Record<ImplementedProblemType, string> = {
  "longest-subarray-target-sum": `
n, target = map(int, input().split())
arr = list(map(int, input().split()))

left = 0
current_sum = 0
best = 0

for right in range(n):
    current_sum += arr[right]

    while current_sum > target and left <= right:
        current_sum -= arr[left]
        left += 1

    if current_sum == target:
        best = max(best, right - left + 1)

print(best)
`.trim(),

  "maximum-fixed-window-sum": `
n, k = map(int, input().split())
arr = list(map(int, input().split()))

window_sum = sum(arr[:k])
best = window_sum

for right in range(k, n):
    window_sum += arr[right] - arr[right - k]
    best = max(best, window_sum)

print(best)
`.trim(),

  "minimum-fixed-window-average": `
n, k = map(int, input().split())
arr = list(map(int, input().split()))

window_sum = sum(arr[:k])
best = window_sum

for right in range(k, n):
    window_sum += arr[right] - arr[right - k]
    best = min(best, window_sum)

print(f"{best / k:.6f}")
`.trim(),

  "count-close-pairs": `
n, max_difference = map(int, input().split())
arr = list(map(int, input().split()))

arr.sort()

left = 0
count = 0

for right in range(n):
    while arr[right] - arr[left] > max_difference:
        left += 1
    count += right - left

print(count)
`.trim(),

  "two-sum-sorted": `
n, target = map(int, input().split())
arr = list(map(int, input().split()))

left = 0
right = n - 1
found = False

while left < right:
    total = arr[left] + arr[right]

    if total == target:
        found = True
        break
    elif total < target:
        left += 1
    else:
        right -= 1

print("YES" if found else "NO")
`.trim(),

  "remove-duplicates-sorted": `
n = int(input())
arr = list(map(int, input().split()))

unique = []

for value in arr:
    if not unique or unique[-1] != value:
        unique.append(value)

print(len(unique))
print(*unique)
`.trim(),

"second-largest-element": `
n = int(input().strip())
arr = list(map(int, input().split()))

if len(arr) != n or n < 2:
    raise ValueError("Invalid array size")

largest = None
second_largest = None

for num in arr:
    if largest is None or num > largest:
        second_largest = largest
        largest = num
    elif num < largest and (
        second_largest is None or num > second_largest
    ):
        second_largest = num

if second_largest is None:
    raise ValueError("No distinct second-largest element")

print(second_largest)
`.trim(),
"rotate-array": `
n, k = map(int, input().split())
arr = list(map(int, input().split()))

k %= n
if k:
    arr = arr[-k:] + arr[:-k]

print(*arr)
`.trim(),
"maximum-subarray-sum": `
n = int(input())
arr = list(map(int, input().split()))

max_ending_here = arr[0]
max_so_far = arr[0]

for i in range(1, n):
    max_ending_here = max(arr[i], max_ending_here + arr[i])
    max_so_far = max(max_so_far, max_ending_here)

print(max_so_far)
`.trim(),

  "reverse-linked-list": `
n = int(input())

if n < 0:
    raise ValueError("Invalid list size")

arr = list(map(int, input().split())) if n > 0 else []

if len(arr) != n:
    raise ValueError("Invalid array size")

if n == 0:
    print("EMPTY")
else:
    print(*arr[::-1])
`.trim(),

  "middle-linked-list": `
n = int(input())
arr = list(map(int, input().split()))
if len(arr) != n or n < 1:
    raise ValueError("Invalid array size")
print(arr[n // 2])
`.trim(),

  "detect-linked-list-cycle": `
n = int(input())
arr = list(map(int, input().split())) if n > 0 else []
pos = int(input())
if len(arr) != n:
    raise ValueError("Invalid array size")
if pos < -1 or pos >= n:
    raise ValueError("Invalid cycle position")
print("YES" if pos != -1 else "NO")
`.trim(),

   "valid-parentheses": `
s = input().strip()
stack = []
pairs = {')': '(', ']': '[', '}': '{'}

for ch in s:
    if ch in '([{':
        stack.append(ch)
    elif ch in pairs:
        if not stack or stack.pop() != pairs[ch]:
            print("NO")
            break
else:
    print("YES" if not stack else "NO")
`.trim(),

"next-greater-element": `
n = int(input())
arr = list(map(int, input().split()))

if n < 1 or len(arr) != n:
    raise ValueError("Invalid array size")

result = [-1] * n
stack = []

for i in range(n):
    while stack and arr[i] > arr[stack[-1]]:
        result[stack.pop()] = arr[i]
    stack.append(i)

print(*result)
`.trim(),

"min-stack": `
n = int(input())
stack = []

for _ in range(n):
    parts = input().split()
    operation = parts[0]

    if operation == "PUSH":
        stack.append(int(parts[1]))
    elif operation == "POP":
        if stack:
            stack.pop()
    elif operation == "MIN":
        print(min(stack) if stack else "EMPTY")
    else:
        raise ValueError("Invalid operation")
`.trim(),
"palindrome-check": `
s = input().strip()
print("YES" if s == s[::-1] else "NO")
`.trim(),

"anagram-check": `
s1 = input().strip()
s2 = input().strip()
print("YES" if sorted(s1) == sorted(s2) else "NO")
`.trim(),

"longest-common-prefix": `
n = int(input())
words = [input().strip() for _ in range(n)]

if n < 1:
    raise ValueError("Invalid number of strings")

prefix = words[0]

for word in words[1:]:
    while not word.startswith(prefix):
        prefix = prefix[:-1]
        if not prefix:
            break
    if not prefix:
        break

print(prefix if prefix else "-1")
`.trim(),
  "binary-search-target": `
n, target = map(int, input().split())
arr = list(map(int, input().split()))

left, right = 0, n - 1
answer = -1

while left <= right:
    mid = (left + right) // 2

    if arr[mid] == target:
        answer = mid
        break
    elif arr[mid] < target:
        left = mid + 1
    else:
        right = mid - 1

print(answer)
`.trim(),

  "first-occurrence": `
n, target = map(int, input().split())
arr = list(map(int, input().split()))

left, right = 0, n - 1
answer = -1

while left <= right:
    mid = (left + right) // 2

    if arr[mid] == target:
        answer = mid
        right = mid - 1
    elif arr[mid] < target:
        left = mid + 1
    else:
        right = mid - 1

print(answer)
`.trim(),

  "lower-bound": `
n, target = map(int, input().split())
arr = list(map(int, input().split()))

left, right = 0, n
while left < right:
    mid = (left + right) // 2

    if arr[mid] < target:
        left = mid + 1
    else:
        right = mid

print(left if left < n else -1)
`.trim(),


  "bubble-sort": `
n = int(input().strip())
arr = list(map(int, input().split()))

for i in range(n - 1):
    swapped = False
    for j in range(n - 1 - i):
        if arr[j] > arr[j + 1]:
            arr[j], arr[j + 1] = arr[j + 1], arr[j]
            swapped = True
    if not swapped:
        break

print(*arr)
`.trim(),

  "selection-sort": `
n = int(input().strip())
arr = list(map(int, input().split()))

for i in range(n - 1):
    min_index = i
    for j in range(i + 1, n):
        if arr[j] < arr[min_index]:
            min_index = j
    arr[i], arr[min_index] = arr[min_index], arr[i]

print(*arr)
`.trim(),

  "merge-sorted-arrays": `
n, m = map(int, input().split())
a = list(map(int, input().split()))
b = list(map(int, input().split()))

i = j = 0
result = []

while i < n and j < m:
    if a[i] <= b[j]:
        result.append(a[i])
        i += 1
    else:
        result.append(b[j])
        j += 1

result.extend(a[i:])
result.extend(b[j:])

print(*result)
`.trim(),

  "sort-colors": `
n = int(input().strip())
arr = list(map(int, input().split()))

low = 0
mid = 0
high = n - 1

while mid <= high:
    if arr[mid] == 0:
        arr[low], arr[mid] = arr[mid], arr[low]
        low += 1
        mid += 1
    elif arr[mid] == 1:
        mid += 1
    else:
        arr[mid], arr[high] = arr[high], arr[mid]
        high -= 1

print(*arr)
`.trim(),

  "merge-sort": `
n = int(input().strip())
arr = list(map(int, input().split()))

def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    result = []
    i = 0
    j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result

print(*merge_sort(arr))
`.trim(),


  "range-sum-query": `
n, q = map(int, input().split())
arr = list(map(int, input().split()))

for _ in range(q):
    l, r = map(int, input().split())
    print(sum(arr[l:r + 1]))
`,

  "equilibrium-index": `
n = int(input())
arr = list(map(int, input().split()))

total = sum(arr)
left_sum = 0

for i, value in enumerate(arr):
    if left_sum == total - left_sum - value:
        print(i)
        break
    left_sum += value
else:
    print(-1)
`,

  "range-update-queries": `
n, q = map(int, input().split())
diff = [0] * (n + 1)

for _ in range(q):
    l, r, x = map(int, input().split())
    diff[l] += x
    diff[r + 1] -= x

result = []
current = 0

for i in range(n):
    current += diff[i]
    result.append(current)

print(*result)
`,

};

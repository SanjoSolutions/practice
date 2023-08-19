def f(x):
    return (x - 2) ** 2 + 1

def fd(x):
    return 2 * x - 4

x = 3
a = 0.5
previous_x = None

def iteration():
    global x
    global previous_x
    m = fd(x)
    previous_x = x
    x -= a * m

iteration()
while x != previous_x:
    iteration()

print(str(f(x)) + ' for x = ' + str(x))
